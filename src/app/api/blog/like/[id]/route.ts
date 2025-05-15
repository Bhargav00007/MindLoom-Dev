/* eslint-disable */
import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../../../lib/config/db";
import BlogModel from "../../../../../../lib/models/blogmodel";
import UserModel from "../../../../../../lib/models/user";
import { isValidObjectId } from "mongoose";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const blogId = resolvedParams.id;

    if (!blogId || !isValidObjectId(blogId)) {
      return NextResponse.json(
        { error: "Invalid or missing blog ID" },
        { status: 400 }
      );
    }

    const { userId } = await req.json();
    if (!userId || !isValidObjectId(userId)) {
      return NextResponse.json(
        { error: "Invalid or missing userId" },
        { status: 400 }
      );
    }

    const blog = await BlogModel.findById(blogId);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const alreadyLiked = blog.likes.some(
      (like: any) => like.userId?.toString() === userId
    );

    let updatedLikes;
    if (alreadyLiked) {
      updatedLikes = blog.likes.filter(
        (like: any) => like.userId?.toString() !== userId
      );
    } else {
      updatedLikes = [...blog.likes, { userId }];
    }

    await BlogModel.findByIdAndUpdate(
      blogId,
      { likes: updatedLikes },
      { runValidators: false }
    );

    return NextResponse.json(
      { liked: !alreadyLiked, likes: updatedLikes.length },
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
