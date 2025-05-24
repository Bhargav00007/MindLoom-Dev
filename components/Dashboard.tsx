"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { PointerHighlight } from "../components/ui/pointer-highlight";

import { SiGithub, SiLinkedin, SiOnlyfans } from "react-icons/si";

const Dashboard = () => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center mt-20 px-4 text-center">
      {session ? (
        <>
          <img
            src={(session.user?.image as string) || "/profileimage.jpg"}
            alt="Profile"
            className="rounded-full h-24 w-24 border mb-4 object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = "/profileimage.jpg";
            }}
          />
          <h1 className="text-2xl lg:text-3xl font-bold text-green-500 mb-2">
            Hey There, {session.user?.name}
          </h1>
          <p className="text-lg lg:text-xl font-medium text-gray-700 mb-4">
            {session.user?.email}
          </p>
          <button
            onClick={() => signOut()}
            className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <div className="mx-10 lg:mx-auto max-w-lg lg:pb-10 pb-7 -mt-10   text-2xl  font-bold tracking-tight md:text-4xl">
            Welcome to
            <PointerHighlight>
              <span>MindLoom Blogs</span>
            </PointerHighlight>
          </div>
          <img
            src="/profileimage.jpg"
            alt="Profile Placeholder"
            className="h-28 w-28 rounded-full shadow-lg mb-6"
          />
          <div className="space-y-4 w-full max-w-xs">
            <p className="text-lg text-gray-700">Sign in with</p>
            <hr className="text-gray-400" />

            <button
              onClick={() => signIn("google")}
              className="w-full flex items-center justify-center px-6 py-2 bg-gray-100 shadow-md rounded-lg hover:bg-gray-200 transition-all"
            >
              <FcGoogle className="mr-2" />
              Google
            </button>

            <button
              onClick={() => signIn("linkedin")}
              className="w-full flex items-center justify-center px-6 py-2 bg-[#0077b5] text-white shadow-md rounded-lg hover:bg-[#005f91] transition-all"
            >
              <SiLinkedin className="mr-2" />
              LinkedIn
            </button>

            <button
              onClick={() => signIn("google")}
              className="w-full flex items-center justify-center px-6 py-2 bg-[#00aeef] text-white shadow-md rounded-lg hover:bg-[#00aeef]/80 transition-all"
            >
              <SiOnlyfans className="mr-1" />
              OnlyFans
            </button>
            <button
              onClick={() => signIn("github")}
              className="w-full flex items-center justify-center px-6 py-2 bg-black text-white shadow-md rounded-lg hover:bg-black/80 transition-all"
            >
              <SiGithub className="mr-2" />
              GitHub
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
