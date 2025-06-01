"use client";
import { useState, useEffect, useRef } from "react";
import Loading from "../components/ui/Loading"; // Adjust the import path as necessary

export default function Showreel() {
  const [isLoading, setIsLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null); // To keep the video reference

  // Timeout to prevent infinite spinner if video load fails
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!videoLoaded) {
        setIsLoading(false); // Hide spinner even if video doesn't load
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [videoLoaded]);

  const handleLoadedData = () => {
    setIsLoading(false);
    setVideoLoaded(true);
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-lg  mb-20 mt-10 my-20">
          <Loading />
        </div>
      )}

      {!isLoading && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="rounded-3xl mx-auto mt-20 px-4 py-6 
             w-full max-w-[90%] 
             md:max-w-[720px] 
             lg:max-w-[640px] 
             xl:max-w-[900px]"
          controls
          controlsList="nodownload"
          src={"/mindloomtrailer.mp4"}
          onLoadedData={handleLoadedData}
        />
      )}
    </div>
  );
}
