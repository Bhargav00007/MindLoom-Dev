"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BlogItem from "../../../components/Blogitem";
import { toast } from "react-toastify";
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

type User = {
  _id: string;
  name: string;
  email: string;
  image?: string;
};

export default function DeletePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const userRes = await fetch(
          `/api/user-by-email?email=${session?.user?.email}`
        );
        const userData = await userRes.json();
        if (!userData.success) throw new Error("User fetch failed");

        setUser(userData.user);

        const profileRes = await fetch(`/api/profile/${userData.user._id}`);
        const profileData = await profileRes.json();
        if (profileData.success) {
          setBlogs(profileData.blogs);
        }
      } catch (err) {
        console.error("Failed to load user blogs", err);
        toast.error("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchUserBlogs();
    }
  }, [session]);

  const handleDelete = async (blogId: string) => {
    try {
      const res = await fetch("/api/blog", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blogId }),
      });

      const result = await res.json();
      if (result.success) {
        setBlogs((prev) => prev.filter((b) => b._id !== blogId));
        toast.success("Blog deleted successfully");
      } else {
        toast.error("Failed to delete blog");
      }
    } catch (err) {
      console.error("Delete error", err);
      toast.error("Something went wrong");
    } finally {
      setConfirmId(null);
    }
  };

  if (loading) return <MoonLoader />;
  if (!user) return <p>User not found</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 mt-10">
      <div className="flex items-center gap-4 mb-6">
        {user?.image && (
          <img
            src={user.image}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover mx-auto sm:mx-0"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null; // Prevent infinite loop in case fallback also fails
              target.src = "/profileimage.jpg";
            }}
          />
        )}

        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
        </div>
      </div>
      <h1 className="text-xl mb-5">{user.name}'s Creations:</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog._id} className="rounded-lg bg-white p-4 shadow">
              <div>
                <BlogItem blog={blog} />
                <button
                  onClick={() => setConfirmId(blog._id)}
                  className="  w-full text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg "
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            You have nothing to delete, Create a post first!
          </p>
        )}
      </div>

      {/* Confirmation Dialog */}
      {confirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this blog post?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
