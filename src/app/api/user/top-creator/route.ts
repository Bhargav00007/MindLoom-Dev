import { NextResponse } from "next/server";
import connectToDB from "../../../../../lib/config/db";
import User from "../../../../../lib/models/user";

export async function GET() {
  try {
    await connectToDB();

    const users = await User.find({})
      .select("name image followers following")
      .lean();

    const usersWithCounts = users.map((user) => ({
      _id: user._id,
      name: user.name,
      image: user.image, // ✅ use 'image' here
      followers: user.followers?.length || 0,
      following: user.following?.length || 0,
    }));

    const topUsers = usersWithCounts
      .sort((a, b) => b.followers - a.followers)
      .slice(0, 3);

    return NextResponse.json(topUsers);
  } catch (error) {
    console.error("Failed to fetch top creators:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
