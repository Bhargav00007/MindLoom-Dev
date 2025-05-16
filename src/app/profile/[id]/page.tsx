"use client";

import { Key, SetStateAction, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import BlogItem from "../../../../components/Blogitem";
import FollowButton from "../../../../components/FollowButton";
import Link from "next/link";
import { useLoading } from "../../../../components/LoadingProvider";

export default function UserProfilePage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  type User = {
    _id: string;
    name: string;
    image?: string;
    followers?: string[];
    following?: string[];
    [key: string]: any;
  };

  const [user, setUser] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerType, setDrawerType] = useState("followers");
  const [drawerUsers, setDrawerUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      startLoading(); // ✅ Start global loader
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
        stopLoading(); // ✅ Stop global loader
      }
    };

    if (id) fetchProfile();
  }, [id]);

  useEffect(() => {
    const fetchDrawerUsers = async () => {
      if (!user || !drawerType) return;

      const ids = user[drawerType];
      if (!Array.isArray(ids) || ids.length === 0) {
        setDrawerUsers([]);
        return;
      }

      const results = await Promise.all(
        ids.map(async (id: string) => {
          try {
            const res = await fetch(`/api/profile/${id}`);
            const data = await res.json();
            return data.success ? data.user : null;
          } catch {
            return null;
          }
        })
      );

      setDrawerUsers(results.filter(Boolean) as User[]);
    };

    if (showDrawer) fetchDrawerUsers();
  }, [showDrawer, drawerType, user]);

  const isOwnProfile = session?.user?.id === user?._id;
  const followerCount = user?.followers?.length || 0;
  const followingCount = user?.following?.length || 0;

  const openDrawer = (type: SetStateAction<string>) => {
    setDrawerType(type);
    setShowDrawer(true);
  };

  const closeDrawer = () => setShowDrawer(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 relative">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
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

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full ">
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <div className="text-sm text-gray-600 flex gap-4 mt-1 ">
              <button
                onClick={() => openDrawer("followers")}
                className="cursor-pointer hover:underline"
              >
                {followerCount} Followers
              </button>
              <button
                onClick={() => openDrawer("following")}
                className="cursor-pointer hover:underline"
              >
                {followingCount} Following
              </button>
            </div>

            {!isOwnProfile && user && (
              <div className="sm:hidden mt-4 w-full cursor-pointer">
                <FollowButton
                  targetUserId={user._id}
                  initialFollowerCount={followerCount}
                  initialFollowingCount={followingCount}
                  initiallyFollowing={
                    user.followers?.includes(session?.user?.id || "") || false
                  }
                />
              </div>
            )}
          </div>
        </div>

        {!isOwnProfile && user && (
          <div className="hidden sm:block">
            <FollowButton
              targetUserId={user._id}
              initialFollowerCount={followerCount}
              initialFollowingCount={followingCount}
              initiallyFollowing={
                user.followers?.includes(session?.user?.id || "") || false
              }
            />
          </div>
        )}
      </div>

      <hr className="border-t border-gray-400 my-6" />

      <h1 className="text-xl mb-5">{user?.name}'s Creations:</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog._id} className="rounded-lg bg-white">
              <BlogItem blog={blog} />
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            This user has not posted any blogs yet.
          </p>
        )}
      </div>

      {/* Drawer Overlay */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-end transition-all duration-300 ease-in-out">
          <div className="bg-white w-full sm:w-[80%] md:w-[400px] h-full shadow-lg p-6 overflow-y-auto transition-transform duration-300 ease-in-out transform translate-x-0 animate-slide-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold capitalize">{drawerType}</h2>
              <button
                onClick={closeDrawer}
                className="text-gray-600 hover:text-black"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {drawerUsers.length > 0 ? (
                drawerUsers.map((u) => (
                  <Link
                    href={`/profile/${u._id}`}
                    key={u._id}
                    className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded"
                  >
                    <img
                      src={u.image || "/default-avatar.png"}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium">{u.name}</span>
                  </Link>
                ))
              ) : (
                <p className="text-gray-400">No users found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
