// lib/models/notifications.ts
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    redirectUrl: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null, // Make it optional for global notifications
    },
    createdAt: { type: Date, default: Date.now, expires: 604800 },
  },
  { timestamps: true },
);

// Delete the existing model to force schema update
if (mongoose.models.Notification) {
  delete mongoose.models.Notification;
}

export default mongoose.model("Notification", NotificationSchema);
