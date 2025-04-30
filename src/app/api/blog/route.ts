import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "../../../../lib/config/db";
import BlogModel from "../../../../lib/models/blogmodel";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
          errorCode: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const formData = await request.formData();
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const image = formData.get("image") as Blob | null;

    if (!title || !description || !category || !image) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
          errorCode: "MISSING_FIELDS",
        },
        { status: 400 }
      );
    }

    // Image handling
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uniqueFileName = `image_${Date.now()}.png`;
    const filePath = path.join(uploadsDir, uniqueFileName);
    const buffer = Buffer.from(await image.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Create blog
    const newBlog = new BlogModel({
      title,
      description,
      category,
      authorName: session.user.name || "Anonymous",
      authorImage: session.user.image || "",
      imagePath: `/uploads/${uniqueFileName}`,
    });

    await newBlog.save();

    return NextResponse.json({
      success: true,
      data: {
        ...newBlog.toObject(),
        _id: newBlog._id.toString(),
      },
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        errorCode: "SERVER_ERROR",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const blogs = (await BlogModel.find()
      .sort({ createdAt: -1 })
      .lean()) as Array<{ _id: any; [key: string]: any }>;

    return NextResponse.json({
      success: true,
      data: blogs.map((blog) => ({
        ...blog,
        _id: blog._id.toString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        errorCode: "SERVER_ERROR",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
