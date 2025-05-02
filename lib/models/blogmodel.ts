// models/Blog.ts

import mongoose, { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    authorName: {
      type: String,
      required: [true, "Author name is required"],
    },
    authorImage: {
      type: String,
      required: [true, "Author image is required"],
    },
    imagePath: {
      type: String,
      required: [true, "Image path is required"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Use existing model if already compiled (important in Next.js hot-reloading)
const BlogModel = models.Blog || model("Blog", BlogSchema);

export default BlogModel;
