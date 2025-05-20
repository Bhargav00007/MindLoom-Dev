"use client";

import React from "react";

type Navbar2Props = {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

const categories = [
  "All",
  "Following",
  "Startup",
  "Technology",
  "Lifestyle",
  "Health",
];

const Navbar2: React.FC<Navbar2Props> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <nav className="bg-gray-100  px-6 py-2 overflow-x-auto mt-4">
      <div className="flex flex-nowrap items-center whitespace-nowrap justify-center w-max mx-auto">
        {categories.map((category, index) => (
          <div key={category} className="flex items-center">
            <button
              onClick={() => onSelectCategory(category)}
              className={` cursor-pointer px-4 pb-2 text-sm font-medium transition-colors duration-150 ${
                selectedCategory === category
                  ? "border-b-2 border-[#0B0A32] text-[#0B0A32]"
                  : "text-gray-700 hover:text-pink-600"
              }`}
            >
              {category}
            </button>
            {index < categories.length - 1 && (
              <div className="h-4 border-l border-gray-400 mx-2" />
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navbar2;
