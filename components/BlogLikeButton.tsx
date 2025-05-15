"use client";

import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";

type Props = {
  blogId: string;
};

const BlogLikeButton = ({ blogId }: Props) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch(`/api/blog/${blogId}`);
        const result = await res.json();

        if (!res.ok || !result.data) {
          throw new Error(result.message || "Failed to load likes");
        }

        const likes = Array.isArray(result.data.likes) ? result.data.likes : [];

        setLikesCount(likes.length);
        setLiked(userId ? likes.includes(userId) : false);
      } catch (err) {
        console.error("Failed to fetch likes:", err);
      }
    };

    if (blogId && userId) fetchLikes();
  }, [blogId, userId]);

  const toggleLike = async () => {
    if (!userId) {
      toast.error("Please sign in first");
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/blog/like/${blogId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (res.ok) {
        setLikesCount(typeof data.likes === "number" ? data.likes : 0);
        setLiked(data.liked);
        toast.success(data.liked ? "Liked!" : "Unliked");
      } else {
        toast.error(data.error || "Error updating like");
      }
    } catch (err) {
      console.error("Toggle like failed:", err);
      toast.error("Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={isLoading}
      className={`mt-4 flex items-center gap-2 px-4 py-2 bg-white rounded transition pb-7 ${
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
