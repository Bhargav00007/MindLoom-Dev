import { NextResponse } from "next/server";
import connectDB from "../../../../lib/config/db";
import Comment from "../../../../lib/models/comment";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const { blogId, content, userId, username, userImage } = body;

  if (!blogId || !content || !userId || !username) {
    return NextResponse.json(
      { success: false, error: "Missing fields" },
      { status: 400 }
    );
  }

  try {
    const comment = await Comment.create({
      blogId,
      content,
      userId,
      username,
      userImage,
    });

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to save comment" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const blogId = searchParams.get("blogId");

  if (!blogId) {
    return NextResponse.json(
      { success: false, error: "Missing blogId" },
      { status: 400 }
    );
  }

  try {
    const comments = await Comment.find({ blogId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, comments });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
