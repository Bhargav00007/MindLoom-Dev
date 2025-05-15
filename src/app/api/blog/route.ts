import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "../../../../lib/config/db";
import BlogModel from "../../../../lib/models/blogmodel";
import UserModel from "../../../../lib/models/user";
import fs from "fs";
import path from "path";

// Define TypeScript interfaces
interface BlogPost {
  _id: string;
  title: string;
  description: string;
  category: string;
  authorName: string;
  authorImage: string;
  imagePath: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BlogResponse {
  success: boolean;
  data?: BlogPost | BlogPost[];
  message?: string;
  errorCode?: string;
  error?: string;
}

export async function POST(
  request: Request
): Promise<NextResponse<BlogResponse>> {
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

    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!description) missingFields.push("description");
    if (!category) missingFields.push("category");
    if (!image) missingFields.push("image");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
          errorCode: "MISSING_FIELDS",
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
          errorCode: "USER_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uniqueFileName = `image_${Date.now()}.png`;
    const filePath = path.join(uploadsDir, uniqueFileName);
    if (!image) {
      throw new Error("Image is null or undefined");
    }
    const buffer = Buffer.from(await image.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const newBlog = new BlogModel({
      title,
      description,
      category,
      authorId: user._id,
      authorName: session.user.name || "Anonymous",
      authorImage: session.user.image || "",
      imagePath: `/uploads/${uniqueFileName}`,
    });

    await newBlog.save();

    const responseData: BlogPost = {
      _id: newBlog._id.toString(),
      title: newBlog.title,
      description: newBlog.description,
      category: newBlog.category,
      authorName: newBlog.authorName,
      authorImage: newBlog.authorImage,
      imagePath: newBlog.imagePath,
      createdAt: newBlog.createdAt,
      updatedAt: newBlog.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: responseData,
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

export async function GET(): Promise<NextResponse<BlogResponse>> {
  try {
    await connectDB();

    const blogs = await BlogModel.find()
      .sort({ createdAt: -1 })
      .lean<BlogPost[]>();

    const responseData = blogs.map((blog) => ({
      ...blog,
      _id: blog._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      data: responseData,
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

export async function DELETE(
  request: Request
): Promise<NextResponse<BlogResponse>> {
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

    const { blogId } = await request.json();

    if (!blogId) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog ID is required",
          errorCode: "MISSING_BLOG_ID",
        },
        { status: 400 }
      );
    }

    const blog = await BlogModel.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
          errorCode: "BLOG_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    const user = await UserModel.findOne({ email: session.user.email });
    if (!user || blog.authorId.toString() !== user._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden: You can't delete this blog",
          errorCode: "FORBIDDEN",
        },
        { status: 403 }
      );
    }

    const fullImagePath = path.join(process.cwd(), "public", blog.imagePath);
    if (fs.existsSync(fullImagePath)) {
      fs.unlinkSync(fullImagePath);
    }

    await BlogModel.findByIdAndDelete(blogId);

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
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
