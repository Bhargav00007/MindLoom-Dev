import { NextResponse } from "next/server";
import connectToDB from "../../../../../lib/config/db";
import Blog from "../../../../../lib/models/blogmodel";

export async function GET() {
  try {
    await connectToDB();

    const blogs = await Blog.find({})
      .select(
        "title description imagePath authorName authorImage authorId createdAt likes"
      )
      .lean();

    const sorted = blogs
      .map((blog) => ({
        ...blog,
        likes: blog.likes ?? [],
      }))
      .sort((a, b) => b.likes.length - a.likes.length)
      .slice(0, 6);

    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Error fetching top liked blogs:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
