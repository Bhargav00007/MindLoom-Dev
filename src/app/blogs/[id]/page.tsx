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

  // FETCH BLOG
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { id } = params;

        const res = await fetch(`/api/blog/${id}`, {
          cache: "no-store",
        });

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

  // FETCH COMMENTS
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

  // STOP SPEECH
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // FIX LINKS PROPERLY
  const processBlogContent = (html: string) => {
    if (!html) return "";

    // DON'T TOUCH EXISTING LINKS
    let processedHtml = html;

    // ONLY CONVERT PLAIN TEXT URLS
    const urlRegex = /(?<!href="|">)((https?:\/\/|www\.)[^\s<]+)/g;

    processedHtml = processedHtml.replace(urlRegex, (match) => {
      let cleanUrl = match.trim();

      // REMOVE TRAILING CHARACTERS
      cleanUrl = cleanUrl.replace(/[.,;!?]+$/, "");

      // ADD HTTPS IF MISSING
      const href = cleanUrl.startsWith("http")
        ? cleanUrl
        : `https://${cleanUrl}`;

      return `
          <a
            href="${href}"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-500 underline hover:text-blue-700 transition-all duration-200 break-all"
          >
            ${cleanUrl}
          </a>
        `;
    });

    return processedHtml;
  };

  // REMOVE LINKS FROM SPEECH
  const removeLinksFromText = (text: string) => {
    const urlRegex = /((https?:\/\/|www\.)[^\s]+)/g;

    return text.replace(urlRegex, "");
  };

  // TEXT TO SPEECH
  const handleToggleSpeech = () => {
    const speech = window.speechSynthesis;

    if (!blog) return;

    // PAUSE
    if (isSpeaking && !isPaused) {
      speech.pause();
      setIsPaused(true);
      return;
    }

    // RESUME
    if (isPaused) {
      speech.resume();
      setIsPaused(false);
      return;
    }

    speech.cancel();

    const tempDiv = document.createElement("div");

    tempDiv.innerHTML = blog.description;

    let plainText = tempDiv.innerText || tempDiv.textContent || "";

    // REMOVE URLS
    plainText = removeLinksFromText(plainText);

    const textToSpeak = `${blog.title}. ${plainText}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    const setVoice = () => {
      const voices = speech.getVoices();

      const preferredVoice =
        voices.find((v) =>
          /female|zira|samantha|google us english/i.test(v.name),
        ) || voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.lang = "en-US";

      speech.speak(utterance);

      synthRef.current = utterance;

      setIsSpeaking(true);

      setIsPaused(false);

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
    };

    if (speech.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = setVoice;
    } else {
      setVoice();
    }
  };

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  if (!blog) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <MoonLoader size={40} color="#e11d48" />
      </div>
    );
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <style jsx global>{`
        article a {
          color: #3b82f6;
          text-decoration: underline;
          transition: all 0.2s ease;
          word-break: break-word;
        }

        article a:hover {
          color: #1d4ed8;
        }
      `}</style>

      <div className="flex flex-col items-center p-6 max-w-4xl mx-auto w-full">
        {/* TITLE */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-start">
          {blog.title}
        </h1>

        {/* AUTHOR */}
        <Link
          href={`/profile/${blog.authorId}`}
          className="flex items-center gap-4 mb-2 px-4 py-2 transition"
        >
          <img
            src={blog.authorImage}
            alt={blog.authorName}
            className="w-12 h-12 object-cover rounded-full"
            loading="lazy"
          />

          <div className="text-center sm:text-left">
            <p className="font-semibold text-gray-800">{blog.authorName}</p>

            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center justify-center text-base text-gray-700 mb-4 gap-6 bg-white rounded-full px-4 py-2">
          {/* VOICE */}
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

          {/* COMMENTS */}
          <div className="flex items-center cursor-pointer ml-2">
            <FaRegComment size={20} className="text-gray-600" />

            <span className="ml-2">{commentCount}</span>
          </div>

          {/* LIKES */}
          <div className="flex items-center cursor-pointer">
            <BlogLikeButton blogId={blog._id} />
          </div>
        </div>

        {/* CATEGORY */}
        <div className="mb-4">
          <span className="text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            #{blog.category}
          </span>
        </div>

        {/* IMAGE */}
        <div className="lg:w-[60%] w-full mb-8">
          <img
            src={blog.imagePath}
            alt={blog.title}
            className="w-full h-auto max-h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* CONTENT */}
        <article className="prose lg:prose-xl max-w-4xl w-full">
          <div
            className="text-gray-700 leading-relaxed prose max-w-none lg:mx-20 lg:my-10 mx-5 my-5"
            dangerouslySetInnerHTML={{
              __html: processBlogContent(blog.description),
            }}
          />
        </article>

        {/* COMMENTS */}
        <CommentSection blogId={blog._id} />
      </div>
    </>
  );
};

export default Page;
