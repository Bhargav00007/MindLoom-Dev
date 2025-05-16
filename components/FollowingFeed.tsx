"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BlogItem from "./Blogitem";
import { useLoading } from "./LoadingProvider";
import { toast } from "react-toastify";

type Blog = {
  _id: string;
  title: string;
  description: string;
  imagePath: string;
  authorName: string;
  authorImage: string;
  authorId: string;
  createdAt: string;
};

const FollowingFeed = () => {
  const { data: session } = useSession();
  const { startLoading, stopLoading } = useLoading();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showFollowing, setShowFollowing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowingBlogs = async () => {
    startLoading();
    setError(null);
    try {
      const response = await fetch("/api/blog/following");
      const data = await response.json();

      if (data.success && Array.isArray(data.blogs)) {
        setBlogs(data.blogs);
      } else {
        setError("No posts found from followed users.");
      }
    } catch (err) {
      setError("Failed to fetch following posts.");
    } finally {
      stopLoading();
    }
  };

  const handleToggle = () => {
    if (!session) {
      toast.error("Please sign in first!");
      return;
    }

    if (!showFollowing) {
      fetchFollowingBlogs();
    }
    setShowFollowing(!showFollowing);
  };

  return (
    <div className="my-4 px-4">
      <button
        onClick={handleToggle}
        className={`px-7 py-2 rounded-full text-white font-medium lg:ml-15  m-2 ${
          showFollowing
            ? "bg-gray-400 hover:bg-gray-500"
            : "bg-gray-400 hover:bg-gray-500"
        }`}
      >
        {showFollowing ? "Show All" : "#Following"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {showFollowing && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 lg:m-15 m-2">
          {blogs.length > 0 ? (
            blogs.map((blog) => <BlogItem key={blog._id} blog={blog} />)
          ) : (
            <p className="text-gray-500 col-span-full">No posts found.</p>
          )}
        </div>
      )}

      {showFollowing && <hr className="border-t border-gray-400 my-6" />}
    </div>
  );
};

export default FollowingFeed;
