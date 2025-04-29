import React from "react";
import Link from "next/link";

type Props = {
  blog: {
    _id: string;
    title: string;
    description: string;
    imagePath: string;
    authorName: string;
    authorImage: string;
    createdAt: string; // assuming this is an ISO date string from MongoDB
  };
};

const BlogItem = ({ blog }: Props) => {
  if (!blog || !blog._id || !blog.title || !blog.description) {
    return null;
  }

  // Format the createdAt date nicely
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/blogs/${blog._id}`}>
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white cursor-pointer hover:shadow-xl transition">
        {/* Blog Image */}
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <img
            src={blog.imagePath}
            alt={blog.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
          <p className="text-gray-600 mb-4">
            {blog.description.length > 100
              ? `${blog.description.slice(0, 100)}...`
              : blog.description}
          </p>

          {/* Author Info */}
          <div className="flex items-center mb-4">
            <img
              src={blog.authorImage}
              alt={blog.authorName}
              className="w-8 h-8 rounded-full object-cover mr-2"
            />
            <div className="text-sm text-gray-700">
              <div className="font-semibold">{blog.authorName}</div>
              <div className="text-gray-500 text-xs">{formattedDate}</div>
            </div>
          </div>

          {/* Description */}

          {/* Read More */}
          <div className="text-blue-500 flex items-center">
            <span>Read more</span>
            <span className="ml-1">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogItem;
