"use client";

import { useParams } from "next/navigation";
import CommentSection from "../../../../components/CommentSection";
import React, { useEffect, useState } from "react";

type Blog = {
  _id: string;
  title: string;
  description: string;
  imagePath: string;
  authorName: string;
  authorImage: string;
  createdAt: string;
  category: string;
};

const Page = () => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { id } = params;

        const res = await fetch(`/api/blog/${id}`, { cache: "no-store" });
        const { success, data, message } = await res.json();

        if (!success) {
          setError(message || "Failed to fetch blog");
          return;
        }

        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError("Failed to load blog post");
      }
    };

    fetchBlog();
  }, [params]);

  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  if (!blog)
    return (
      <div className="text-center p-8 animate-pulse">Loading blog post...</div>
    );

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col items-center p-8 max-w-7xl mx-auto">
      <div className="w-full aspect-video mb-8">
        <img
          src={blog.imagePath}
          alt={blog.title}
          className="w-full h-full object-cover rounded-xl shadow-lg"
          loading="lazy"
        />
      </div>

      <h1 className="text-4xl font-bold mb-4 text-center">{blog.title}</h1>

      <div className="flex items-center gap-4 mb-6">
        <img
          src={blog.authorImage}
          alt={blog.authorName}
          className="w-12 h-12 rounded-full object-cover"
          loading="lazy"
        />
        <div>
          <p className="font-semibold text-gray-800">{blog.authorName}</p>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
      </div>

      <div className="mb-6">
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {blog.category}
        </span>
      </div>

      <article className="prose lg:prose-xl max-w-4xl w-full">
        <div className="text-gray-600 leading-relaxed">
          {blog.description.split("\n").map((para, index) => (
            <p key={index} className="mb-4">
              {para}
            </p>
          ))}
        </div>
      </article>
      <CommentSection blogId={blog._id} />
    </div>
  );
};

export default Page;
