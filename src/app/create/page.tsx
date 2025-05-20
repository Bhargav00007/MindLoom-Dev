"use client";

import React, { useState } from "react";
import { FaBold } from "react-icons/fa";
import { FaItalic } from "react-icons/fa";
import { FaUnderline } from "react-icons/fa";
import { FaHighlighter } from "react-icons/fa";

import { toast } from "react-toastify";
import { FileUpload } from "../../../components/ui/file-uplaod";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";

const Create = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technology");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("<p></p>");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Highlight,
      Placeholder.configure({
        placeholder: "Write your blog content here...",
      }),
    ],
    content: description,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setThumbnail(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!thumbnail) {
      toast.error("Please upload a thumbnail image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("image", thumbnail);

      const response = await fetch("/api/blog", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Blog created successfully!");
      } else {
        toast.error(data.msg || "Please Sign In before you create!");
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
      toast.error("Error submitting blog!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Blog</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* File Upload */}
        <div>
          <div className="w-full border border-dashed border-neutral-300 rounded-lg p-4 bg-black">
            <FileUpload onChange={handleFileUpload} />
          </div>
        </div>

        {/* Blog Title */}
        <div>
          <label className="block text-xl font-medium text-gray-700 mb-2">
            Title*
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full text-xl rounded-md border  "
            required
          />
        </div>

        {/* Blog Description */}
        <div>
          <label className="block text-xl font-medium text-gray-700 mb-2">
            Your Story*
          </label>

          {/* Toolbar */}
          {editor && (
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`px-2 py-1 rounded cursor-pointer ${
                  editor.isActive("bold")
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                <FaBold />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`px-2 py-1 rounded cursor-pointer ${
                  editor.isActive("italic")
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                <FaItalic />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`px-2 py-1 rounded cursor-pointer ${
                  editor.isActive("underline")
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                <FaUnderline />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                className={`px-2 py-1 rounded cursor-pointer ${
                  editor.isActive("highlight")
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-200"
                }`}
              >
                <FaHighlighter />
              </button>
            </div>
          )}

          <div
            className="border border-gray-300 rounded-md bg-white min-h-[300px] max-h-[500px] overflow-y-auto p-2"
            aria-placeholder="Write your blog content here..."
          >
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

        {/* Blog Category */}
        <div>
          <label className="block text-xl font-medium text-gray-700 mb-1">
            Category*
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full text-sm  rounded-md"
          >
            <option value="Technology">Technology</option>
            <option value="Health">Health</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Education">Education</option>
            <option value="Personal Growth">Personal Growth</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md mt-20"
        >
          {loading ? "Adding New Blog..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default Create;
