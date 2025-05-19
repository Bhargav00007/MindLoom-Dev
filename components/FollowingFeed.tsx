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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowingBlogs = async () => {
      if (!session) {
        toast.error("Please sign in to view followed blogs.");
        return;
      }

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

    fetchFollowingBlogs();
  }, [session]);

  return (
    <div className="my-4 px-4">
      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 lg:m-15 m-2">
        {blogs.length > 0 ? (
          blogs.map((blog) => <BlogItem key={blog._id} blog={blog} />)
        ) : (
          <p className="text-gray-500 col-span-full">No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default FollowingFeed;
