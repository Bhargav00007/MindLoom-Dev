import mongoose, { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: { type: String, required: true },
    userImage: { type: String },
    content: { type: String, required: true },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export default models.Comment || model("Comment", CommentSchema);
