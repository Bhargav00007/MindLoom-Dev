"use client";

import React, { useEffect, useState } from "react";
import BlogItem from "./Blogitem";

type Blog = {
  _id: string;
  title: string;
  description: string;
  imagePath: string;
  authorName: string;
  authorImage: string;
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
    return <div className="text-center p-8">Loading blogs...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-8 w-full max-w-3xl px-2">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition duration-300"
          >
            <BlogItem blog={blog} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default BlogList;
