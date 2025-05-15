"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

type Props = {
  targetUserId: string;
  initialFollowerCount: number;
  initialFollowingCount: number;
  initiallyFollowing: boolean;
};

export default function FollowButton({
  targetUserId,
  initialFollowerCount,
  initialFollowingCount,
  initiallyFollowing,
}: Props) {
  const { data: session } = useSession();
  const isOwnProfile = session?.user?.id === targetUserId;

  const [followerCount, setFollowerCount] = useState(initialFollowerCount);
  const [followingCount, setFollowingCount] = useState(initialFollowingCount);
  const [isFollowing, setIsFollowing] = useState(initiallyFollowing);
  const [loading, setLoading] = useState(false);

  const toggleFollow = async () => {
    if (!session?.user) return toast.error("Please sign in to follow");

    setLoading(true);
    try {
      const res = await fetch(`/api/follow/${targetUserId}`, {
        method: "POST",
      });

      const data = await res.json();
      if (data.success) {
        setIsFollowing(data.following);
        setFollowerCount(data.followerCount);
        setFollowingCount(data.followingCount);
      } else {
        toast.error(data.message || "Failed to toggle follow");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mt-4 cursor-pointer">
      {/* Follower/Following counts: always visible */}

      {/* Desktop: follow button on the right */}
      {/* Follow button placement */}
      <div className="w-full max-w-sm mt-2">
        {/* Desktop: button on the right */}
        <div className="hidden sm:flex justify-end">
          {!isOwnProfile && (
            <button
              onClick={toggleFollow}
              disabled={loading}
              className={`px-10 py-2 rounded text-white transition ${
                isFollowing
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>

        {/* Mobile: full width follow button under user info */}
        <div className="flex sm:hidden mt-4 w-full">
          {!isOwnProfile && (
            <button
              onClick={toggleFollow}
              disabled={loading}
              className={`w-full text-center px-4 py-2 rounded text-white transition ${
                isFollowing
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
