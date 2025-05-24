"use client";

import React, { useEffect, useState } from "react";
import BlogItem from "./Blogitem";
import { MoonLoader } from "react-spinners";
import Navbar2 from "../components/Navbar2";
import FollowingFeed from "./FollowingFeed";

type Blog = {
  _id: string;
  title: string;
  description: string;
  imagePath: string;
  authorName: string;
  authorImage: string;
  authorId: string;
  createdAt: string;
  category?: string;
};

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(21);

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
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load blogs"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs =
    selectedCategory === "All"
      ? blogs
      : blogs.filter(
          (blog) =>
            blog.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 21);
  };

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
      <Navbar2
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="flex justify-center">
        {selectedCategory === "Following" ? (
          <FollowingFeed />
        ) : (
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:mx-30 m-5">
              {filteredBlogs.slice(0, visibleCount).map((blog) => (
                <BlogItem key={blog._id} blog={blog} />
              ))}
            </div>

            {visibleCount < filteredBlogs.length && (
              <button
                onClick={handleLoadMore}
                className="my-6 px-6 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition"
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BlogList;
