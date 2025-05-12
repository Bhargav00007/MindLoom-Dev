import { NextResponse } from "next/server";
import connectToDB from "../../../../../lib/config/db";
import User from "../../../../../lib/models/user";
import Blog from "../../../../../lib/models/blogmodel";

type LeanUser = {
  _id: string;
  name: string;
  email: string;
  image?: string;
};

type LeanBlog = {
  _id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  authorImage: string;
  imagePath: string;
  category: string;
  date: Date;
  likes: string[];
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();

    const { id } = await params;

    // Validate ObjectId format (optional but helpful)
    if (!id || id.length !== 24) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Find user by ID
    const user = await User.findById(id).lean<LeanUser>();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Find all blogs created by the user (using real MongoDB _id match)
    const blogs = await Blog.find({ authorId: user._id })
      .sort({ createdAt: -1 })
      .lean<LeanBlog[]>();

    return NextResponse.json({
      success: true,
      user,
      blogs,
    });
  } catch (error) {
    console.error("Error in /api/profile/[id]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
