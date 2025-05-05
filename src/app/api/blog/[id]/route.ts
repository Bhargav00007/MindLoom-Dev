import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/config/db";
import BlogModel from "../../../../../lib/models/blogmodel";
import { isValidObjectId } from "mongoose";

// Define strict response type
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
  // Add other fields as needed
};

export async function GET(request: Request) {
  try {
    await connectDB();

    // Extract ID from URL
    const pathSegments = new URL(request.url).pathname.split("/");
    const blogId = pathSegments[3];

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

    // Use explicit typing with lean()
    const blog = await BlogModel.findById(blogId).lean<BlogDocument>().exec();

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    // Properly typed transformation
    const responseData = {
      ...blog,
      _id: blog._id.toString(),
      createdAt: blog.createdAt.toISOString(),
    };

    return NextResponse.json({ success: true, data: responseData });
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
