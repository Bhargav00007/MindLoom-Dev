"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogItem from "../../../../components/Blogitem";

type Blog = {
  _id: string;
  title: string;
  description: string;
  imagePath: string;
  authorName: string;
  authorImage: string;
  createdAt: string;
  likes?: string[];
};

type User = {
  _id: string;
  name: string;
  email: string;
  image?: string;
};

export default function UserProfilePage() {
  const { id } = useParams(); // Get user ID from route
  const [user, setUser] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile/${id}`);
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setBlogs(data.blogs);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        {user.image && (
          <img
            src={user.image}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
        </div>
      </div>
      <h1 className="text-xl mb-5 ">{user.name}'s Creations:</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog._id} className=" rounded-lg   bg-white">
              <BlogItem blog={blog} />
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            This user has not posted any blogs yet.
          </p>
        )}
      </div>
    </div>
  );
}
