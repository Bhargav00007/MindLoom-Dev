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
  await connectToDB();

  try {
    const resolvedParams = await params;

    const user = await User.findById(resolvedParams.id).lean<LeanUser>();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const blogs = await Blog.find({ authorId: user._id }).lean<LeanBlog[]>();

    return NextResponse.json({
      success: true,
      user,
      blogs,
    });
  } catch (error) {
    console.error("Error in /api/profile/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error", error },
      { status: 500 }
    );
  }
}
