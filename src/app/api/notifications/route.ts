// app/api/notifications/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import connectDB from "../../../../lib/config/db";
import UserModel from "../../../../lib/models/user";

// Clear model cache and get fresh model
let Notification: any;

async function getNotificationModel() {
  if (mongoose.models.Notification) {
    delete mongoose.models.Notification;
  }

  const module = await import("../../../../lib/models/notifications");
  Notification = module.default;
  return Notification;
}

// ✅ GET ALL NOTIFICATIONS (Global)
export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();
    await getNotificationModel();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const notifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: String(error),
      },
      { status: 500 },
    );
  }
}

// ✅ SEND NOTIFICATION (Only for bhargav.pattanayak@gmail.com)
export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Check if user is authorized to send notifications
    if (session.user.email !== "bhargav.pattanayak@gmail.com") {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to send notifications",
        },
        { status: 403 },
      );
    }

    await connectDB();
    await getNotificationModel();

    const body = await request.json();
    const { title, body: notificationBody, redirectUrl } = body;

    console.log("Received notification data:", {
      title,
      notificationBody,
      redirectUrl,
    });

    if (!title || !notificationBody || !redirectUrl) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create notification WITHOUT userId (global notification)
    const notification = new Notification({
      title,
      body: notificationBody,
      redirectUrl,
    });

    await notification.save();

    console.log("Notification saved:", notification);

    return NextResponse.json({
      success: true,
      message: "Notification sent successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: String(error),
      },
      { status: 500 },
    );
  }
}

// ✅ DELETE NOTIFICATION (Admin only)
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Check if user is authorized to delete notifications
    if (session.user.email !== "bhargav.pattanayak@gmail.com") {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to delete notifications",
        },
        { status: 403 },
      );
    }

    await connectDB();
    await getNotificationModel();

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get("notificationId");

    if (!notificationId) {
      return NextResponse.json(
        { success: false, message: "Notification ID required" },
        { status: 400 },
      );
    }

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
