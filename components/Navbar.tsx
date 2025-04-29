"use client";
import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className=" border-gray-200 bg-black  relative z-10 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white font-poppins">
            MindLoom
          </span>
        </Link>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {session ? (
            <>
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                aria-expanded={isDropdownOpen ? "true" : "false"}
                onClick={toggleDropdown}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  src={
                    (session.user?.image as string) ||
                    "/assets/profileimage.jpg"
                  }
                  alt=" "
                  className="rounded-full h-10 w-10 border-2 border-black"
                />
              </button>
              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute top-14 right-0 mt-2 w-48  divide-y divide-gray-100 rounded-lg shadow-lg bg-gray-700 dark:divide-gray-600">
                  <div className="px-4 py-3">
                    <span className="block text-sm text-transparent dark:text-white">
                      {session.user?.name}
                    </span>
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                      {session.user?.email}
                    </span>
                  </div>
                  <ul className="py-2">
                    <li>
                      <a
                        href="dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Profile
                      </a>
                    </li>

                    <li>
                      <button
                        onClick={() => {
                          signOut();
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white w-full text-start"
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div>
              <button
                onClick={() => signIn("google")}
                className=" rounded-lg  px-3 py-1 bg-rose-900 text-white hover:bg-rose-500  transition-all duration-200 font-poppins"
              >
                Log in
              </button>
            </div>
          )}
          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 "
            aria-controls="navbar-user"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-user"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-black dark:bg-black md:dark:bg-transparent">
            <li>
              <Link
                href="/Home"
                className={`block py-2 px-3 rounded md:bg-transparent hover:text-blue-300 ${
                  isActive("/Home")
                    ? "text-blue-500 glow"
                    : "text-gray-700 dark:text-gray-200"
                } hover:bg-gray-700 md:hover:bg-transparent`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`block py-2 px-3 rounded hover:text-blue-300 ${
                  isActive("/about") ? "text-blue-500 glow" : "text-white"
                } hover:bg-gray-700 md:hover:bg-transparent`}
              >
                About
              </Link>
            </li>

            <li>
              <Link
                href="/profile"
                className={`block py-2 px-3 rounded hover:text-blue-300 ${
                  isActive("/profile") ? "text-blue-500 glow" : "text-white"
                } hover:bg-gray-700 md:hover:bg-transparent`}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                href="/create"
                className={`block py-2 px-3 rounded hover:text-blue-300 ${
                  isActive("/create") ? "text-blue-500 glow" : "text-white"
                } hover:bg-gray-700 md:hover:bg-transparent`}
              >
                Create
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
