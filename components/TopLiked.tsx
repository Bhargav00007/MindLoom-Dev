"use client";

import { useEffect, useState } from "react";
import BlogItem from "../components/Blogitem";
import { MoonLoader } from "react-spinners";

type Blog = {
  _id: string;
  title: string;
  description: string;
  imagePath: string;
  authorName: string;
  authorImage: string;
  authorId: string;
  createdAt: string;
  likes?: string[];
};

const TopLikedBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTopLikedBlogs = async () => {
      try {
        const res = await fetch("/api/blog/top-liked");
        if (!res.ok) throw new Error("Failed to fetch top liked blogs");
        const data: Blog[] = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error("Error loading blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopLikedBlogs();
  }, []);

  if (loading) {
    return <></>;
  }

  return (
    <div className="lg:mx-20  mx-10 my-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-start">
        Most Liked Posts:
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog._id}>
            <BlogItem blog={blog} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopLikedBlogs;
