"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";

const Dashboard = () => {
  const { data: session } = useSession();

  return (
    <div className="px-5 ">
      {session ? (
        <>
          <img
            src={session.user?.image as string}
            className="rounded-full h-20 w-20 border"
          ></img>
          <h1 className="lg:text-3xl text-2xl text-green-500 font-bold">
            Hey There, {session.user?.name}
          </h1>
          <p className="lg:text-2xl text-xl font-semibold">
            {session.user?.email}
          </p>
          <button
            onClick={() => signOut()}
            className="border  bg-rose-400 px-5 py-1 my-2 hover:bg-transparent transition-all duration-300 rounded-lg"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <h1 className="lg:text-3xl text-2xl text-red-500  font-bold m-5">
            You&apos;re not logged in
          </h1>
          <div className="flex space-x-5">
            <button
              onClick={() => signIn("google")}
              className="border  rounded-full px-10 py-1 bg-gray-300 hover:bg-gray-100 transition-all duration-300"
            >
              Sign in <FcGoogle className="inline-flex ml-1 mb-1" />
            </button>
            <button
              onClick={() => signIn("github")}
              className="border  rounded-full bg-green-500 px-10 py-1 hover:bg-gray-100 transition-all duration-300"
            >
              Sign in <SiGithub className="inline-flex ml-1 mb-1" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
