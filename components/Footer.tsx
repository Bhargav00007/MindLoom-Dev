import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="text-gray-600 body-font pt-20 bg-black lg:mx-20">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
          <Image
            src="/logonew.png"
            width={35}
            height={35}
            className="h-8 bg-white rounded-full"
            alt="MindLoom Logo"
          />
          <span className="ml-3 text-xl text-white">MindLoom</span>
        </a>
        <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          © 2025 MindLoom —
          <a
            href="https://github.com/Bhargav00007"
            className="text-gray-600 ml-1"
            rel="noopener noreferrer"
            target="_blank"
          >
            @Bhargav
          </a>
        </p>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/_bhrgv._/"
            className="text-gray-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
            </svg>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/Bhargav00007"
            className="ml-3 text-gray-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.373 0 12a12 12 0 008.205 11.385c.6.11.82-.26.82-.577v-2.165c-3.338.724-4.042-1.61-4.042-1.61-.547-1.387-1.336-1.756-1.336-1.756-1.092-.746.083-.731.083-.731 1.207.085 1.84 1.239 1.84 1.239 1.072 1.835 2.81 1.305 3.495.998.108-.776.42-1.305.762-1.605-2.665-.305-5.466-1.336-5.466-5.934 0-1.31.47-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 016.003 0c2.29-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.234 1.911 1.234 3.221 0 4.61-2.804 5.625-5.476 5.922.432.372.816 1.102.816 2.222v3.293c0 .319.218.692.824.575A12.003 12.003 0 0024 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
