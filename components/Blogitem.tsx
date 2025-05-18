"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import BlogLikeButton from "./BlogLikeButton";

type Props = {
  blog: {
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
};

const BlogItem = ({ blog }: Props) => {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  if (!blog || !blog._id) return null;

  let hasUserLiked = false;
  if (currentUserId && Array.isArray(blog.likes)) {
    hasUserLiked = blog.likes.includes(currentUserId);
  }
  const totalLikes = blog.likes?.length || 0;

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col w-full h-full rounded-lg overflow-hidden border border-gray-100  bg-white">
      {/* Image */}
      <div className="h-52 w-full overflow-hidden">
        <img
          src={blog.imagePath}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <h2 className="text-lg font-semibold mb-2 line-clamp-2">
          {blog.title}
        </h2>

        <div className="text-gray-700 text-sm">
          <p className="line-clamp-3">{blog.description}</p>
          <Link href={`/blogs/${blog._id}`}>
            <span className="text-blue-600 text-sm hover:underline cursor-pointer">
              Read more
            </span>
          </Link>
        </div>

        {/* Bottom section */}
        <div className="flex justify-between items-center mt-4">
          <Link
            href={`/profile/${blog.authorId}`}
            className="flex items-center gap-2 group"
          >
            <img
              src={blog.authorImage}
              alt={blog.authorName}
              className="w-8 h-8 rounded-full object-cover  group-hover:border-blue-500 transition"
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = "/profileimage.jpg";
              }}
            />

            <div>
              <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition">
                {blog.authorName}
              </p>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
          </Link>

          <BlogLikeButton blogId={blog._id} />
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
