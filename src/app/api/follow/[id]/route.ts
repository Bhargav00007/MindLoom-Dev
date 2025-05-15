import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/config/db";
import User from "../../../../../lib/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/authOptions";
import { Types } from "mongoose";

// ✅ Define the expected shape with strict ObjectId arrays
type LeanUser = {
  _id: Types.ObjectId;
  followers?: Types.ObjectId[];
  following?: Types.ObjectId[];
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    const { id: targetUserId } = await params;
    const currentUserEmail = session?.user?.email;

    if (!session || !currentUserEmail) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const currentUser = await User.findOne({ email: currentUserEmail });
    const targetUser = await User.findById(targetUserId);

    if (!targetUser || !currentUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Ensure both arrays exist
    if (!Array.isArray(targetUser.followers)) targetUser.followers = [];
    if (!Array.isArray(currentUser.following)) currentUser.following = [];

    const alreadyFollowing = targetUser.followers.some(
      (id: { toString: () => any }) =>
        id.toString() === currentUser._id.toString()
    );

    if (alreadyFollowing) {
      targetUser.followers = targetUser.followers.filter(
        (id: { toString: () => any }) =>
          id.toString() !== currentUser._id.toString()
      );
      currentUser.following = currentUser.following.filter(
        (id: { toString: () => string }) => id.toString() !== targetUserId
      );
    } else {
      targetUser.followers.push(currentUser._id);
      currentUser.following.push(targetUser._id);
    }

    await targetUser.save();
    await currentUser.save();

    // ✅ Refetch updated documents with strong typing
    const updatedTargetUser = await User.findById(
      targetUserId
    ).lean<LeanUser>();
    const updatedCurrentUser = await User.findById(
      currentUser._id
    ).lean<LeanUser>();

    return NextResponse.json({
      success: true,
      following: !alreadyFollowing,
      followerCount: updatedTargetUser?.followers?.length || 0,
      followingCount: updatedCurrentUser?.following?.length || 0,
    });
  } catch (error) {
    console.error("Follow API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
