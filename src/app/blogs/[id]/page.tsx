import React from "react";

type Props = {
  params: { id: string };
};

// Helper to get the base URL
function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // In browser
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
}

// Function to fetch the blog data based on its ID
async function getBlog(id: string) {
  const res = await fetch(`${getBaseUrl()}/api/blog?id=${id}`, {
    cache: "no-store", // Optional: prevents caching
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blog");
  }

  return res.json();
}

const Page = async ({ params }: Props) => {
  // Fetch the blog data based on the ID from the URL
  const blog = await getBlog(params.id);

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col items-center p-8">
      {/* Blog Image */}
      <div className="w-full max-w-3xl mb-8">
        <img
          src={blog.imagePath}
          alt={blog.title}
          className="h-96 w-full object-cover rounded-lg"
        />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

      {/* Author and Date */}
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={blog.authorImage}
          alt={blog.authorName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="text-gray-600">
          <p className="font-semibold">{blog.authorName}</p>
          <p className="text-sm">{formattedDate}</p>
        </div>
      </div>

      {/* Category */}
      <div className="mb-6">
        <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded">
          {blog.category}
        </span>
      </div>

      {/* Full Description */}
      <p className="max-w-2xl text-center text-gray-700 leading-relaxed">
        {blog.description}
      </p>
    </div>
  );
};

export default Page;
