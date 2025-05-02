import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../../../lib/config/db";
import BlogModel from "../../../../../../lib/models/blogmodel";
import { isValidObjectId } from "mongoose";

// Ensure this route runs dynamically
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const blogId = params.id;

    if (!blogId) {
      return NextResponse.json({ error: "Missing blog ID" }, { status: 400 });
    }

    if (!isValidObjectId(blogId)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const blog = await BlogModel.findById(blogId);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    blog.likes = blog.likes || [];

    const alreadyLiked = blog.likes.includes(userId);
    if (alreadyLiked) {
      blog.likes = blog.likes.filter((uid: string) => uid !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    return NextResponse.json(
      { liked: !alreadyLiked, likes: blog.likes.length },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error toggling like:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
