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
    likes?: string[];
  };
};

const BlogItem = ({ blog }: Props) => {
  if (!blog || !blog._id || !blog.title || !blog.description) return null;

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="w-full max-w-5xl ">
      <div className="flex gap-5">
        {/* Image */}
        <div className="w-72 h-44 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={blog.imagePath}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between flex-grow">
          {/* Title */}
          <h2 className="text-xl font-semibold">{blog.title}</h2>

          {/* Description + Read More */}
          <Link href={`/blogs/${blog._id}`}>
            <p className="text-gray-600 text-sm mt-1 cursor-pointer">
              {blog.description.length > 120
                ? `${blog.description.slice(0, 120)}... Read more`
                : blog.description}
            </p>
          </Link>

          {/* Footer Row: Author + Like */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <img
                src={blog.authorImage}
                alt={blog.authorName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="text-sm font-medium text-gray-700">
                  {blog.authorName}
                </div>
                <div className="text-xs text-gray-500">{formattedDate}</div>
              </div>
            </div>

            <BlogLikeButton
              blogId={blog._id}
              initialLiked={false}
              initialLikeCount={blog.likes?.length || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
