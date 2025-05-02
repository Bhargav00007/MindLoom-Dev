import React from "react";
import Link from "next/link";
import BlogLikeButton from "./BlogLikeButton";

type Props = {
  blog: {
    _id: string;
    title: string;
    description: string;
    imagePath: string;
    authorName: string;
    authorImage: string;
    createdAt: string;
    likes?: string[]; // 👈 Make sure this is passed from backend
  };
};

const BlogItem = ({ blog }: Props) => {
  if (!blog || !blog._id || !blog.title || !blog.description) {
    return null;
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleLikeButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click event from propagating to the parent div
  };

  const handleReadMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click event from propagating to the parent div
  };

  return (
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
        <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
        <p className="text-gray-600 mb-4">
          {blog.description.length > 100
            ? `${blog.description.slice(0, 100)}...`
            : blog.description}
        </p>

        {/* Author Info */}
        <div className="flex items-center mb-4 justify-between">
          <div className="flex items-center">
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

          {/* ❤️ Like Button */}
          <div onClick={handleLikeButtonClick}>
            <BlogLikeButton
              blogId={blog._id}
              initialLiked={false} // Set to true if liked by this user (optional improvement)
              initialLikeCount={blog.likes?.length || 0}
            />
          </div>
        </div>

        {/* Read More */}
        <Link href={`/blogs/${blog._id}`} passHref>
          <div
            className="text-blue-500 flex items-center"
            onClick={handleReadMoreClick} // Stop propagation for the "Read More" link click
          >
            <span>Read more</span>
            <span className="ml-1">→</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BlogItem;
