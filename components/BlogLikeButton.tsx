"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";

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

        if (userId) {
          setLiked(likes.includes(userId));
        }
      } catch (err) {
        console.error("Failed to fetch likes:", err);
      }
    };

    if (blogId) fetchLikes();
  }, [blogId, userId]);

  const toggleLike = async () => {
    if (!userId) {
      toast.error("Please sign in to like this post.");
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
      }
    } catch (err) {
      console.error("Toggle like failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={isLoading}
      className={`flex items-center text-sm transition ${
        isLoading ? "opacity-50" : "cursor-pointer"
      }`}
    >
      {liked ? (
        <FaHeart size={20} className="text-red-500" />
      ) : (
        <FaRegHeart size={20} className="text-gray-500" />
      )}
      <span className="ml-2 text-gray-600 text-base">{likesCount}</span>
    </button>
  );
};

export default BlogLikeButton;
