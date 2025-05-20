"use client";

import React, { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  // Scroll show/hide effect
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowNavbar(currentY < lastScrollY || currentY < 10);
      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-black transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between p-4">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center">
          {/* <img src="/logo.png" alt="logo" className="h-8 w-8 mr-2" /> */}
          <span className="text-2xl font-semibold text-white font-poppins">
            MindLoom
          </span>
        </Link>

        {/* Avatar & Hamburger wrapper */}
        <div className="flex items-center space-x-3 md:space-x-0 md:order-2">
          {/* Avatar or Sign in */}
          {session ? (
            <div className="order-1 md:order-2 relative">
              <button
                onClick={toggleDropdown}
                className="flex rounded-full bg-gray-800 h-10 w-10 overflow-hidden border-2 border-black"
              >
                <img
                  src={(session.user?.image as string) || "/profileimage.jpg"}
                  alt="user"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/profileimage.jpg";
                  }}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-14 lg:-right-20 -right-10 w-56 bg-gray-700 rounded-lg shadow-md z-50">
                  <div className="px-4 py-3 text-white">
                    <p className="text-sm">{session.user?.name}</p>
                    <p className="text-xs text-gray-400">
                      {session.user?.email}
                    </p>
                  </div>
                  <ul className="text-sm text-white">
                    <li>
                      <Link
                        href={`/profile/${session.user.id}`}
                        className="block px-4 py-2 hover:bg-gray-600"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/create"
                        className="block px-4 py-2 hover:bg-gray-600"
                      >
                        Create
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/delete"
                        className="block px-4 py-2 hover:bg-gray-600"
                      >
                        Delete
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-2 hover:bg-gray-600"
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="order-1 md:order-2 px-3 py-1 bg-rose-900 text-white rounded hover:bg-rose-600"
            >
              Sign in
            </button>
          )}

          {/* Hamburger Button */}
          <button
            onClick={toggleMobileMenu}
            type="button"
            className="order-2 md:order-1 md:hidden p-2 text-gray-400 hover:bg-gray-700 rounded"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`w-full md:flex md:items-center md:w-auto md:space-x-8 ${
            isMobileMenuOpen ? "block mt-4" : "hidden"
          }`}
        >
          <ul className="flex flex-col md:flex-row md:mt-0 mt-4 space-y-2 space-x-7  md:space-y-0 text-white font-medium">
            {[
              { href: "/Home", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/create", label: "Create" },
              { href: "/Top", label: "Popular" },
              {
                href: session?.user?.id ? `/profile/${session.user.id}` : "",
                label: "Profile",
                show: !!session?.user?.id,
              },
            ]
              .filter((link) => link.show !== false)
              .map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block py-2 px-3 rounded hover:text-[#b3e3f7] ${
                      isActive(link.href) ? "text-[#67cbe0]" : "text-white"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};
