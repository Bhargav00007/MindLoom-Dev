import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/config/db";
import BlogModel from "../../../../../lib/models/blogmodel";
import { isValidObjectId } from "mongoose";
import { FlattenMaps } from "mongoose";

interface BlogDocument {
  _id: string;
  title: string;
  description: string;
  imagePath: string;
  authorName: string;
  authorImage: string;
  createdAt: Date;
  category: string;
  __v: number;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid blog ID format" },
        { status: 400 }
      );
    }

    await connectDB();

    const blog = await BlogModel.findById(id).lean().exec();

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    // Type assertion and proper conversion
    const blogDoc = blog as unknown as FlattenMaps<BlogDocument>;

    const responseData = {
      ...blogDoc,
      _id: blogDoc._id.toString(),
      createdAt: blogDoc.createdAt.toISOString(),
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
