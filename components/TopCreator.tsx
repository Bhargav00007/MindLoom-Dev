"use client";

import { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import Link from "next/link";

type Creator = {
  _id: string;
  name: string;
  image: string;
  followers: number;
  following: number;
};

const TopCreators = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTopCreators = async () => {
      try {
        const res = await fetch("/api/user/top-creator");
        if (!res.ok) throw new Error("Failed to fetch top creators");
        const data: Creator[] = await res.json();
        setCreators(data);
      } catch (err) {
        console.error("Error fetching creators:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCreators();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <MoonLoader size={40} color="#e11d48" />
      </div>
    );
  }

  return (
    <div className="lg:mx-20 mx-10 my-10">
      <h2 className="text-2xl font-semibold mb-2 text-gray-800 text-start">
        Most Followed Creators:
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {creators.map((creator) => (
          <div
            key={creator._id}
            className="flex flex-col items-center text-center bg-white p-4 rounded-xl "
          >
            <Link href={`/profile/${creator._id}`}>
              <img
                src={creator.image}
                alt={creator.name}
                className="w-20 h-20 rounded-full object-cover  mb-3 hover:scale-105 transition-transform"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = "/default-avatar.png";
                }}
              />
            </Link>
            <p className="text-lg font-medium">{creator.name}</p>
            <div className="flex gap-4 text-sm text-gray-600 mt-1">
              <span>{creator.followers.toLocaleString()} followers</span>
              <span>{creator.following.toLocaleString()} following</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCreators;
