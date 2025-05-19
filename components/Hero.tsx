"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { HeroScroll } from "./Hero2";

export function HeroSectionOne() {
  const router = useRouter();

  return (
    <div className="lg:pt-5">
      <div className="relative mx-auto flex max-w-7xl py-20 px-4 sm:px-10 flex-col items-center justify-center bg-black">
        <Navbar />

        {/* Vertical borders */}
        <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>

        {/* Content */}
        <div className="px-4 py-10 md:py-20">
          <h1 className="relative z-10 mx-auto max-w-4xl text-center text-4xl sm:text-3xl md:text-4xl lg:text-7xl font-bold text-slate-700 dark:text-slate-300">
            {"Where Thoughts Become Threads of Innovation."
              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                  className="mr-2 inline-block"
                >
                  {word}
                </motion.span>
              ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="relative z-10 mx-auto max-w-xl py-4 text-center text-sm sm:text-base md:text-lg font-normal text-neutral-600 dark:text-neutral-400"
          >
            Mindloom is your digital atelier for ideas. We help thinkers,
            writers, and creators spin thoughts into clarity. Whether you're
            blogging, brainstorming, or building—start here. Because every great
            idea deserves a beautiful beginning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1 }}
            className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => router.push("/Home")}
              className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Explore Now
            </button>
            <button
              onClick={() => router.push("/signin")}
              className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900"
            >
              Sign In
            </button>
          </motion.div>
        </div>
      </div>
      <HeroScroll />
    </div>
  );
}

const Navbar = () => {
  return <div />;
};
