"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { PointerHighlight } from "../components/ui/pointer-highlight";

export function HeroSectionOne() {
  const router = useRouter();

  return (
    <div className="lg:pt-0">
      <div className="relative mx-auto flex max-w-7xl py-10 px-4 sm:px-10 flex-col items-center justify-center bg-black">
        <Navbar />

        {/* Vertical borders */}
        <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-800/80 ml-4 sm:ml-0">
          <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-800/80 mr-4 sm:mr-0">
          <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>

        {/* Content */}
        <div className="px-4 md:py-10">
          <div className="mx-15 lg:mx-80 max-w-lg lg:py-10 py-10 text-2xl text-neutral-400 font-bold tracking-tight md:text-4xl">
            <PointerHighlight>
              <span>MindLoom Blogs</span>
            </PointerHighlight>
          </div>
          <h1 className="relative z-10 mx-auto max-w-4xl text-center text-4xl sm:text-3xl md:text-4xl lg:text-7xl font-bold text-slate-300">
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
            className="relative z-10 mx-auto max-w-xl py-4 text-center text-sm sm:text-base md:text-lg font-normal text-neutral-400"
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
              className="cursor-pointer w-60 transform rounded-lg  px-6 py-2 font-medium  transition-all duration-300 hover:-translate-y-0.5  bg-white text-black hover:bg-gray-200"
            >
              Explore Now
            </button>
            <button
              onClick={() => router.push("/signin")}
              className=" cursor-pointer w-60 transform rounded-lg border border-gray-300  px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5  border-gray-700 bg-black text-white hover:bg-gray-900"
            >
              Sign In
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const Navbar = () => {
  return <div />;
};
