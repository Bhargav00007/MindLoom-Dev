"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BlogItem from "../../../components/Blogitem";
import { toast } from "react-toastify";
import { MoonLoader } from "react-spinners";
import Link from "next/link";

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

export default function EditPage() {
  const { data: session } = useSession();

  const [user, setUser] = useState<User | null>(null);

  const [blogs, setBlogs] = useState<Blog[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const userRes = await fetch(
          `/api/user-by-email?email=${session?.user?.email}`,
        );

        const userData = await userRes.json();

        if (!userData.success) throw new Error("User fetch failed");

        setUser(userData.user);

        // ONLY USER BLOGS
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

  if (loading)
    return (
      <div className="flex items-center justify-center h-[400px]">
        <MoonLoader size={40} color="#e11d48" />
      </div>
    );

  if (!user) return <p>User not found</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        {user?.image && (
          <img
            src={user.image}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover mx-auto sm:mx-0"
            onError={(e) => {
              const target = e.currentTarget;

              target.onerror = null;

              target.src = "/profileimage.jpg";
            }}
          />
        )}

        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
        </div>
      </div>

      <h1 className="text-xl mb-5">{user.name}'s Blogs:</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog._id} className="rounded-lg bg-white p-4 shadow">
              <div>
                <BlogItem blog={blog} />

                <Link
                  href={`/edit/${blog._id}`}
                  className="block text-center w-full text-sm text-white bg-black hover:bg-gray-800 px-3 py-2 rounded-lg"
                >
                  Edit Blog
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            You have nothing to edit, Create a post first!
          </p>
        )}
      </div>
    </div>
  );
}
