"use client";

import React, { useEffect, useState } from "react";
import BlogItem from "./Blogitem";
import { MoonLoader } from "react-spinners";
import FollowingFeed from "./FollowingFeed";

type Blog = {
  _id: string;
  title: string;
  description: string;
  imagePath: string;
  authorName: string;
  authorImage: string;
  authorId: string; // ✅ Added authorId
  createdAt: string;
};

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/blog");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setBlogs(result.data);
        } else {
          setError("Invalid data format received from server");
          console.error("Unexpected data format:", result);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load blogs"
        );
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <MoonLoader size={40} color="#e11d48" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <>
      <FollowingFeed />
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:mx-20 m-5">
          {blogs.map((blog) => (
            <BlogItem key={blog._id} blog={blog} />
          ))}
        </div>
      </div>
    </>
  );
};
export default BlogList;
