import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/config/db";
import BlogModel from "../../../../../lib/models/blogmodel";
import { isValidObjectId } from "mongoose";

// Define correct type for likes
type BlogDocument = {
  _id: string;
  title: string;
  description: string;
  imagePath: string;
  authorName: string;
  authorImage: string;
  createdAt: Date;
  category: string;
  __v: number;
  likes: { userId: string }[]; // expecting this shape
};

export async function GET(request: Request) {
  try {
    await connectDB();

    const pathSegments = new URL(request.url).pathname.split("/");
    const blogId = pathSegments[3]; // /api/blog/[id]

    if (!blogId) {
      return NextResponse.json(
        { success: false, message: "Missing blog ID" },
        { status: 400 }
      );
    }

    if (!isValidObjectId(blogId)) {
      return NextResponse.json(
        { success: false, message: "Invalid blog ID format" },
        { status: 400 }
      );
    }

    const blog = await BlogModel.findById(blogId)
      .lean<Partial<BlogDocument>>()
      .exec();

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    // Ensure likes is a valid array
    const likeUserIds = Array.isArray(blog.likes)
      ? blog.likes
          .filter((like): like is { userId: string } => !!like?.userId)
          .map((like) => like.userId.toString())
      : [];

    const responseData = {
      ...blog,
      _id: blog._id?.toString(),
      createdAt: blog.createdAt?.toISOString(),
      likes: likeUserIds,
    };

    return NextResponse.json(
      { success: true, data: responseData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
