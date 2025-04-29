import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "../../../../lib/config/db";
import BlogModel from "../../../../lib/models/blogmodel";
import fs from "fs";
import path from "path";

// ===== POST: Create a New Blog =====
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const image = formData.get("image") as Blob;

    if (!title || !description || !category || !image) {
      return NextResponse.json(
        { msg: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save image to /public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uniqueFileName = `image_${Date.now()}.png`;
    const filePath = path.join(uploadsDir, uniqueFileName);
    const buffer = Buffer.from(await image.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const relativeImagePath = `/uploads/${uniqueFileName}`;

    // Create a new blog entry
    const newBlog = new BlogModel({
      title,
      description,
      category,
      authorName: session.user?.name || "Unknown",
      authorImage: session.user?.image || "",
      imagePath: relativeImagePath,
    });

    await newBlog.save();

    return NextResponse.json({
      msg: "Blog created successfully!",
      blogData: newBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}

// ===== GET: Fetch All Blogs or Fetch a Single Blog by ID =====
export async function GET(request: Request) {
  try {
    await connectDB();

    // Check if there's an 'id' query parameter
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      // Fetch a single blog by its ID
      const blog = await BlogModel.findById(id);
      if (!blog) {
        return NextResponse.json({ msg: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json(blog);
    }

    // Fetch all blogs if no 'id' parameter is provided
    const blogs = await BlogModel.find().sort({ createdAt: -1 });

    return NextResponse.json({
      blogs, // Return wrapped inside { blogs: [...] }
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
