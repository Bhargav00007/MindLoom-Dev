"use client";

import React, { useEffect, useState } from "react";
import { PointerHighlight } from "../../../../components/ui/pointer-highlight";
import Link from "next/link";
import { FaBold, FaItalic, FaUnderline, FaHighlighter } from "react-icons/fa";
import { toast } from "react-toastify";
import { FileUpload } from "../../../../components/ui/file-uplaod";
import { EditorContent, useEditor, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlock from "@tiptap/extension-code-block";
import LinkExtension from "@tiptap/extension-link";
import { MoonLoader } from "react-spinners";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

const CustomCodeBlock = ({ node }: any) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(node.textContent);
    toast.success("Code copied to clipboard!");
  };

  return (
    <div className="relative bg-black text-white rounded p-4 my-4 font-mono">
      <div className="text-sm font-semibold mb-2">Code Block:</div>

      <pre className="whitespace-pre-wrap overflow-x-auto">
        <code>{node.textContent}</code>
      </pre>

      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 bg-white text-black px-2 py-1 text-xs rounded hover:bg-gray-200 transition-colors"
      >
        Copy
      </button>
    </div>
  );
};

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technology");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("<p></p>");
  const [isLoading, setIsLoading] = useState(true);
  const [existingImagePath, setExistingImagePath] = useState("");

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),

      Bold,
      Italic,
      Underline,
      Highlight,

      LinkExtension.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        defaultProtocol: "https",

        protocols: ["http", "https"],

        HTMLAttributes: {
          class:
            "text-blue-500 underline hover:text-blue-700 transition-all duration-200 cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },

        shouldAutoLink: (url) => {
          return true;
        },
      }),

      CodeBlock.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CustomCodeBlock);
        },
      }),

      Placeholder.configure({
        placeholder: "Write your blog content here...",
      }),
    ],

    content: description,

    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setDescription(html);
    },
  });

  // Fetch blog data
  const fetchBlog = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/blog/${id}`);

      if (response.data.success) {
        const blog = response.data.data;

        setTitle(blog.title || "");
        setCategory(blog.category || "Technology");
        setDescription(blog.description || "<p></p>");

        if (blog.imagePath) {
          setThumbnailPreview(blog.imagePath);
          setExistingImagePath(blog.imagePath);
        }
      } else {
        toast.error("Failed to fetch blog");
        router.push("/Home");
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      toast.error("Failed to fetch blog");
      router.push("/Home");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  // Set editor content after data is loaded
  useEffect(() => {
    if (editor && !isLoading && description) {
      editor.commands.setContent(description);
    }
  }, [editor, isLoading, description]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length !== 1) {
      toast.error("Please upload only one image.");
      setThumbnail(null);
      return;
    }

    const file = files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      setThumbnail(null);
      return;
    }

    setThumbnail(file);

    const base64 = await convertToBase64(file);
    setThumbnailPreview(base64);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!thumbnailPreview) {
      toast.error("Please upload a valid thumbnail image.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = existingImagePath;

      // Upload new image only if a new file is selected
      if (thumbnail) {
        const uploadForm = new FormData();
        uploadForm.append("file", thumbnail);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok || !uploadData.success) {
          throw new Error("Failed to upload image");
        }

        imageUrl = uploadData.data.secure_url;
      }

      // Submit blog data - using the correct API endpoint
      const blogData = {
        blogId: id,
        title,
        description,
        category,
        imagePath: imageUrl,
      };

      // Use the main API route with PUT method
      const response = await fetch("/api/blog", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Blog updated successfully!");
        router.push(`/blogs/${id}`);
      } else {
        toast.error(data.message || "Failed to update blog. Please sign in!");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Error updating blog!");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <MoonLoader size={40} color="#0B0A32" />
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
          transition: all 0.2s ease;
        }

        .ProseMirror a:hover {
          color: #1d4ed8;
        }

        .ProseMirror {
          outline: none;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
      `}</style>

      <div className="flex items-center justify-center mb-4">
        <div className="max-w-lg lg:py-10 pt-10 text-2xl text-black font-bold tracking-tight md:text-4xl text-center">
          <PointerHighlight>
            <span>Edit Your Post</span>
          </PointerHighlight>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-md mt-8 my-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="w-full border border-dashed border-neutral-300 rounded-lg p-4 bg-black">
            <FileUpload onChange={handleFileUpload} />
          </div>

          {thumbnailPreview && (
            <div className="w-full">
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="w-full h-full object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}

          <div>
            <label className="block text-xl font-medium text-gray-700 mb-2">
              Title*
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full text-xl rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter your blog title"
            />
          </div>

          <div>
            <label className="block text-xl font-medium text-gray-700 mb-2">
              Your Story*
            </label>

            {editor && (
              <div className="flex gap-2 mb-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                    editor.isActive("bold")
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <FaBold />
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                    editor.isActive("italic")
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <FaItalic />
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                    editor.isActive("underline")
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <FaUnderline />
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHighlight().run()}
                  className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                    editor.isActive("highlight")
                      ? "bg-yellow-400 text-black"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <FaHighlighter />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const url = window.prompt("Enter URL:");
                    if (url) {
                      editor.chain().focus().setLink({ href: url }).run();
                    }
                  }}
                  className="px-2 py-1 rounded cursor-pointer transition-colors bg-gray-200 hover:bg-gray-300"
                  title="Add Link"
                >
                  🔗
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().unsetLink().run()}
                  className="px-2 py-1 rounded cursor-pointer transition-colors bg-gray-200 hover:bg-gray-300"
                  title="Remove Link"
                >
                  🔗❌
                </button>
              </div>
            )}

            <div className="border border-gray-300 rounded-md bg-white min-h-[300px] max-h-[500px] overflow-y-auto p-2">
              {editor ? (
                <EditorContent
                  editor={editor}
                  className="ProseMirror min-h-[300px] focus:outline-none focus:ring-0"
                />
              ) : (
                <p>Loading editor...</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xl font-medium text-gray-700 mb-1">
              Category*
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full text-sm rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Travel">Travel</option>
              <option value="Education">Education</option>
              <option value="Stories & Poems">Stories & Poems</option>
              <option value="Personal Growth">Personal Growth</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="flex items-center justify-center mt-10 gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full cursor-pointer transform rounded-lg border border-gray-300 px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 border-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <MoonLoader size={20} color="#0B0A32" />
                </div>
              ) : (
                "Update Blog"
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <Link
              href={`/blogs/${id}`}
              className="underline text-blue-500 hover:text-blue-700 text-center"
            >
              View Blog
            </Link>
            <Link
              href="/Home"
              className="underline text-blue-500 hover:text-blue-700 text-center"
            >
              Home
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
