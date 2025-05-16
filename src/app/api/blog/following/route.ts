import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/authOptions";
import User from "../../../../../lib/models/user";
import Blog from "../../../../../lib/models/blogmodel";

export async function GET() {
  try {
    // Retrieve the current user's session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find the current user in the database
    const currentUser = await User.findById(session.user.id);

    if (!currentUser || !currentUser.following) {
      return NextResponse.json(
        { success: false, message: "User not found or no following list" },
        { status: 404 }
      );
    }

    // Extract the list of followed user IDs
    const followingIds = currentUser.following.map((user: any) =>
      user._id ? user._id : user
    );

    // Fetch blogs authored by followed users
    const blogs = await Blog.find({ authorId: { $in: followingIds } }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, blogs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching following blogs:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching blogs" },
      { status: 500 }
    );
  }
}
