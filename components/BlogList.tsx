"use client";

import React, { useEffect, useState } from "react";
import BlogItem from "./Blogitem"; // Assuming BlogItem is in the same folder

type Blog = {
  _id: string;
  title: string;
  description: string;
  imagePath: string;
  authorName: string;
  authorImage: string;
  createdAt: string; // assuming this is an ISO date string
};

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blog");
        const data = await response.json();
        console.log("Fetched blogs data:", data);

        // Check if the API sends { blogs: [...] } or just [...]
        if (Array.isArray(data)) {
          setBlogs(data); // Direct array
        } else if (Array.isArray(data.blogs)) {
          setBlogs(data.blogs); // Wrapped in { blogs: [...] }
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.isArray(blogs) &&
        blogs.map((blog) => <BlogItem key={blog._id} blog={blog} />)}
    </div>
  );
};

export default BlogList;
