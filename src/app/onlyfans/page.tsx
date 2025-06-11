"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SiOnlyfans } from "react-icons/si";

const OnlyFansPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [onlyfansData, setOnlyfansData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (status === "loading") {
    return (
      <p className="text-center mt-10 text-gray-600">Checking session...</p>
    );
  }

  const fetchOnlyFansData = async () => {
    if (!username) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/onlyfans?username=${username}`);
      const data = await res.json();
      setOnlyfansData(data);
    } catch (error) {
      console.error("Failed to fetch OnlyFans data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center  px-4 text-center mt-20">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-[#00aeef] text-balance">
        Are you sure you want to choose <br /> OnlyFans as an option?
      </h1>

      <div className="w-full max-w-sm text-left mt-10">
        <label htmlFor="of-username" className="block text-sm font-medium mb-1">
          Enter OnlyFans Username
        </label>
        <input
          id="of-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. madison420ivy"
          className="w-full px-4 py-2 border rounded-md text-sm mb-3"
        />
        <button
          onClick={fetchOnlyFansData}
          disabled={!username}
          className="w-full flex items-center justify-center px-6 py-2 bg-[#00aeef] text-white rounded-lg hover:bg-[#009ed1] transition-all"
        >
          <SiOnlyfans className="mr-2" />
          Fetch OnlyFans
        </button>
      </div>

      {loading && (
        <p className="mt-4 text-sm text-gray-500">Fetching data...</p>
      )}

      {onlyfansData && (
        <>
          <pre className="mt-4 p-4 text-left bg-gray-100 rounded text-sm max-w-xl w-full overflow-auto">
            {JSON.stringify(onlyfansData, null, 2)}
          </pre>
          <button
            onClick={() => (window.location.href = "https://onlyfans.com")}
            className="mt-4 px-6 py-2 bg-[#ff4f9c] text-white rounded-lg hover:bg-[#e8438c] transition-all text-sm sm:text-base mb-20"
          >
            Proceed to OnlyFans Authorization
          </button>
        </>
      )}
    </div>
  );
};

export default OnlyFansPage;
