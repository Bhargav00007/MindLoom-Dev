"use client";

import { useParams } from "next/navigation";
import CommentSection from "../../../../components/CommentSection";
import React, { useEffect, useState, useRef } from "react";
import BlogLikeButton from "../../../../components/BlogLikeButton";
import {
  FaRegComment,
  FaRegPlayCircle,
  FaRegPauseCircle,
} from "react-icons/fa";
import Link from "next/link";
import { MoonLoader } from "react-spinners";

type Blog = {
  _id: string;
  title: string;
  description: string;
  imagePath: string;
  authorName: string;
  authorImage: string;
  authorId: string;
  createdAt: string;
  category: string;
  commentCount?: number;
};

const Page = () => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [commentCount, setCommentCount] = useState<number>(0);
  const params = useParams();
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { id } = params;
        const res = await fetch(`/api/blog/${id}`, { cache: "no-store" });
        const { success, data, message } = await res.json();

        if (!success) {
          setError(message || "Failed to fetch blog");
          return;
        }

        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError("Failed to load blog post");
      }
    };

    fetchBlog();
  }, [params]);

  // Fetch comment count separately
  useEffect(() => {
    const fetchCommentCount = async () => {
      if (!blog?._id) return;
      const res = await fetch(`/api/comments?blogId=${blog._id}`);
      const data = await res.json();
      if (data.success) {
        setCommentCount(data.comments.length);
      }
    };

    fetchCommentCount();
  }, [blog?._id]);

  useEffect(() => {
    // Stop any ongoing speech when the component unmounts
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleToggleSpeech = () => {
    const speech = window.speechSynthesis;

    if (!blog) return;

    if (isSpeaking && !isPaused) {
      speech.pause();
      setIsPaused(true);
      return;
    }

    if (isPaused) {
      speech.resume();
      setIsPaused(false);
      return;
    }

    speech.cancel();

    const utterance = new SpeechSynthesisUtterance(
      `${blog.title}. ${blog.description}`
    );

    const setVoice = () => {
      const voices = speech.getVoices();
      const femaleVoice =
        voices.find((v) =>
          /female|zira|samantha|google us english|woman/i.test(v.name)
        ) || voices[0];

      if (femaleVoice) utterance.voice = femaleVoice;
      speech.speak(utterance);
      synthRef.current = utterance;
      setIsSpeaking(true);
      setIsPaused(false);

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
    };

    // If voices not loaded yet
    if (speech.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = setVoice;
    } else {
      setVoice();
    }
  };

  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  if (!blog)
    return (
      <div className="flex items-center justify-center h-[400px]">
        <MoonLoader size={40} color="#e11d48" />
      </div>
    );

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col items-center p-6 max-w-4xl mx-auto w-full">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-start">
        {blog.title}
      </h1>

      {/* Author section - centered and clickable */}
      <Link
        href={`/profile/${blog.authorId}`}
        className="flex items-center gap-4 mb-2  px-4 py-2 transition"
      >
        <img
          src={blog.authorImage}
          alt={blog.authorName}
          className="w-12 h-12 object-cover rounded-full "
          loading="lazy"
        />
        <div className="text-center sm:text-left">
          <p className="font-semibold text-gray-800">{blog.authorName}</p>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
      </Link>

      {/* Interaction Icons: Listen / Comment / Like */}
      <div className="flex items-center justify-center text-base text-gray-700 mb-4 gap-6">
        {/* Listen */}
        <button
          onClick={handleToggleSpeech}
          title="Listen"
          className="flex items-center cursor-pointer"
        >
          {isSpeaking && !isPaused ? (
            <FaRegPauseCircle size={20} className="text-gray-600" />
          ) : (
            <FaRegPlayCircle size={20} className="text-gray-600" />
          )}
        </button>

        {/* Comment */}
        <div className="flex items-center cursor-pointer">
          <FaRegComment size={20} className="text-gray-600" />
          <span className="ml-1">{commentCount}</span>
        </div>

        {/* Like */}
        <div className="flex items-center cursor-pointer">
          <BlogLikeButton blogId={blog._id} />
        </div>
      </div>

      {/* Category */}
      <div className="mb-4">
        <span className=" text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          #{blog.category}
        </span>
      </div>

      {/* Blog Image (no rounded or shadow) */}
      <div className="w-full md:w-[100%] mb-8">
        <img
          src={blog.imagePath}
          alt={blog.title}
          className="w-full h-auto max-h-[400px] object-cover"
          loading="lazy"
        />
      </div>

      {/* Blog Content */}
      <article className="prose lg:prose-xl max-w-4xl w-full lg:mx-40">
        <div
          className="text-gray-700 leading-relaxed prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.description }}
        />
      </article>

      {/* Comments */}
      <CommentSection blogId={blog._id} />
    </div>
  );
};

export default Page;
