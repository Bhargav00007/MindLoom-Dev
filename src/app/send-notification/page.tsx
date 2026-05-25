// app/send-notification/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { MoonLoader } from "react-spinners";
import { FaTrash, FaClock } from "react-icons/fa";

interface Notification {
  _id: string;
  title: string;
  body: string;
  redirectUrl: string;
  createdAt: string;
}

export default function SendNotificationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    redirectUrl: "",
  });

  // Check if user is authorized
  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user?.email !== "bhargav.pattanayak@gmail.com") {
      router.push("/Home");
    } else {
      fetchNotifications();
    }
  }, [session, status]);

  const fetchNotifications = async () => {
    try {
      setFetching(true);
      const response = await fetch("/api/notifications?limit=100");
      const data = await response.json();

      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to fetch notifications");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.body || !formData.redirectUrl) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setFormData({
          title: "",
          body: "",
          redirectUrl: "",
        });
        fetchNotifications(); // Refresh the list
      } else {
        toast.error(data.message || "Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Error sending notification");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (notificationId: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      const response = await fetch(
        `/api/notifications?notificationId=${notificationId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Notification deleted successfully");
        fetchNotifications(); // Refresh the list
      } else {
        toast.error(data.message || "Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Error deleting notification");
    }
  };

  // Calculate days remaining until deletion
  const getDaysRemaining = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime =
      created.getTime() + 7 * 24 * 60 * 60 * 1000 - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (status === "loading" || fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <MoonLoader size={40} color="#0B0A32" />
      </div>
    );
  }

  if (!session || session.user?.email !== "bhargav.pattanayak@gmail.com") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-4xl mx-auto">
        {/* Send Notification Form */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-8">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Send Notification
            </h1>
            <p className="text-gray-600 mb-8">
              Send announcements to all users
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter notification title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Body *
                </label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter notification message"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Redirect URL *
                </label>
                <input
                  type="text"
                  name="redirectUrl"
                  value={formData.redirectUrl}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="/blogs/123 or /Home"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Example: /blogs/123, /profile/user123, /Home
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <MoonLoader size={20} color="#ffffff" />
                      <span className="ml-2">Sending...</span>
                    </div>
                  ) : (
                    "Send Notification"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Manage Notifications Section */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Manage Notifications
            </h2>
            <p className="text-gray-600 mb-6">
              View and manage all sent notifications. They will auto-delete
              after 7 days.
            </p>

            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No notifications sent yet
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => {
                  const daysRemaining = getDaysRemaining(
                    notification.createdAt,
                  );
                  const isExpiringSoon = daysRemaining <= 2;

                  return (
                    <div
                      key={notification._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            {notification.body}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-500">
                              Sent:{" "}
                              {new Date(
                                notification.createdAt,
                              ).toLocaleDateString()}{" "}
                              at{" "}
                              {new Date(
                                notification.createdAt,
                              ).toLocaleTimeString()}
                            </span>
                            <span
                              className={`flex items-center gap-1 ${
                                isExpiringSoon
                                  ? "text-red-500"
                                  : "text-yellow-600"
                              }`}
                            >
                              <FaClock className="text-xs" />
                              Expires in {daysRemaining} day
                              {daysRemaining !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className="text-sm text-blue-600">
                              Redirects to: {notification.redirectUrl}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete notification"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
