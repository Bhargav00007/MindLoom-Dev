"use client";

import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";

type Props = {
  blogId: string;
  initialLiked: boolean;
  initialLikeCount: number;
};

const BlogLikeButton = ({ blogId, initialLiked, initialLikeCount }: Props) => {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session) return;

    const fetchLikes = async () => {
      try {
        const res = await fetch(`/api/blog/${blogId}`);
        const data = await res.json();
        setLikesCount(data.likes?.length || 0);
        setLiked(data.likes?.includes(session.user?.email || "") || false);
      } catch (err) {
        console.error("Failed to fetch likes:", err);
        toast.error("Could not fetch likes");
      }
    };

    fetchLikes();
  }, [session, blogId]);

  const toggleLike = async () => {
    if (!session?.user?.email) {
      toast.error("Please sign in first");
      return;
    }

    if (isLoading) return;

    if (!blogId || typeof blogId !== "string") {
      toast.error("Invalid blog ID");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/blog/like/${blogId}  `, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.email }),
      });

      const data = await res.json();

      if (res.ok) {
        setLikesCount(data.likes);
        setLiked(data.liked);
        toast.success(data.liked ? "Post liked!" : "Like removed");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      toast.error("Unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={isLoading}
      className={`mt-4 flex items-center gap-2 px-4 py-2 bg-white  rounded transition pb-7 ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {liked ? (
        <FaHeart className="text-red-500" />
      ) : (
        <FaRegHeart className="text-gray-500" />
      )}
      <span className="text-black">{likesCount}</span>
    </button>
  );
};

export default BlogLikeButton;
