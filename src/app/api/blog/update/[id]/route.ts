import { NextResponse } from "next/server";
import connectDB from "../../../../../../lib/config/db";
import BlogModel from "../../../../../../lib/models/blogmodel";
import { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../lib/authOptions";

export async function PUT(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const pathSegments = new URL(req.url).pathname.split("/");
    const blogId = pathSegments[5];

    if (!isValidObjectId(blogId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid blog ID",
        },
        { status: 400 },
      );
    }

    const existingBlog = await BlogModel.findById(blogId);

    if (!existingBlog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
        },
        { status: 404 },
      );
    }

    if (existingBlog.authorEmail !== session.user.email) {
      return NextResponse.json(
        {
          success: false,
          message: "You can only edit your own blogs",
        },
        { status: 403 },
      );
    }

    const body = await req.json();

    const updatedBlog = await BlogModel.findByIdAndUpdate(
      blogId,
      {
        title: body.title,
        description: body.description,
        category: body.category,
        imagePath: body.imagePath,
        authorName: body.authorName,
        authorImage: body.authorImage,
      },
      { new: true },
    );

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
