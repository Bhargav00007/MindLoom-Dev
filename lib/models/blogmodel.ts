import { Schema, model, models, Types } from "mongoose";

const LikeSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    likedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

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
    authorId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
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
      type: [LikeSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const BlogModel = models.Blog || model("Blog", BlogSchema);

export default BlogModel;
