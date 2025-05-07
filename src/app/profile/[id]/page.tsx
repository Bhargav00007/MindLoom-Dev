import { Metadata } from "next";
import Dashboard from "../../../../components/Dashboard";
import Image from "next/image";
import React from "react";

// Fetch profile data including user and blogs
async function getProfileData(id: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/profile/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>; // ✅ Wrapped in Promise
}) {
  const resolvedParams = await params;
  const data = await getProfileData(resolvedParams.id);

  if (!data || !data.user) {
    return <p className="text-center mt-10 text-red-500">User not found</p>;
  }

  const { user, blogs } = data;

  return (
    <div>
      <Dashboard />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Image
            src={user.image || "/default-avatar.png"}
            alt={user.name}
            width={60}
            height={60}
            className="rounded-full"
          />
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Blogs by {user.name}</h3>
        <div className="space-y-4">
          {blogs.length === 0 ? (
            <p className="text-gray-500">
              This user has not posted any blogs yet.
            </p>
          ) : (
            blogs.map((blog: any) => (
              <div
                key={blog._id}
                className="p-4 border rounded-md shadow-sm bg-white"
              >
                <h4 className="text-lg font-medium">{blog.title}</h4>
                <p className="text-sm text-gray-600">
                  {blog.description.slice(0, 100)}...
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
