"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Link from "next/link";

const CommentSection = ({ blogId }: { blogId: string }) => {
  const { data: session } = useSession();

  type Comment = {
    _id: string;
    userImage: string;
    username: string;
    createdAt: string;
    content: string;
    userId: string;
  };

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    const res = await fetch(`/api/comments?blogId=${blogId}`);
    const data = await res.json();
    if (data.success) setComments(data.comments);
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const handleSubmit = async () => {
    if (!session) {
      toast.error("Please sign in to post a comment.");
      return;
    }

    if (!newComment.trim()) return;

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        blogId,
        content: newComment,
        userId: session?.user?.id,
        username: session?.user?.name,
        userImage: session?.user?.image,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setComments([data.comment, ...comments]);
      setNewComment("");
      toast.success("Comment added!");
    }
  };

  return (
    <div className="mt-10 max-w-5xl mx-auto w-full px-4">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>

      <div className="mb-6">
        {session ? (
          <div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border border-gray-300 rounded mb-2 resize-none"
              rows={3}
            />
            <button
              onClick={handleSubmit}
              className="bg-pink-600 text-white px-5 py-2 rounded hover:bg-pink-700 transition"
            >
              Post
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Sign in to post a comment.</p>
        )}
      </div>

      <div className="space-y-6">
        {comments.map((c, index) => (
          <div
            key={c._id}
            className={`${
              index === 0 ? "border-t border-gray-300 pt-4" : ""
            } border-b border-gray-300 pb-4`}
          >
            <div className="flex items-start gap-3 mb-2">
              <Link href={`/profile/${c.userId}`}>
                <img
                  src={c.userImage}
                  alt={c.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </Link>
              <div>
                <Link href={`/profile/${c.userId}`}>
                  <div className="text-sm font-semibold text-gray-800">
                    {c.username}
                  </div>
                </Link>
                <div className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-800 ml-1">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
