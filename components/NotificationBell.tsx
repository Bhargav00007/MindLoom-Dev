// components/NotificationBell.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaBell } from "react-icons/fa";

interface Notification {
  _id: string;
  title: string;
  body: string;
  redirectUrl: string;
  createdAt: string;
}

export const NotificationBell = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get read notifications from localStorage
  const getReadNotifications = (): string[] => {
    const read = localStorage.getItem("readNotifications");
    return read ? JSON.parse(read) : [];
  };

  // Save read notification to localStorage
  const markAsRead = (notificationId: string) => {
    const readNotifications = getReadNotifications();
    if (!readNotifications.includes(notificationId)) {
      readNotifications.push(notificationId);
      localStorage.setItem(
        "readNotifications",
        JSON.stringify(readNotifications),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  // Mark all as read
  const markAllAsRead = () => {
    const allNotificationIds = notifications.map((n) => n._id);
    localStorage.setItem(
      "readNotifications",
      JSON.stringify(allNotificationIds),
    );
    setUnreadCount(0);
  };

  // Calculate unread count
  const calculateUnreadCount = (notifs: Notification[]) => {
    const readNotifications = getReadNotifications();
    return notifs.filter((n) => !readNotifications.includes(n._id)).length;
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications?limit=50");
      const data = await response.json();

      if (data.success) {
        setNotifications(data.data);
        setUnreadCount(calculateUnreadCount(data.data));
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Handle scroll close
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (session) {
      fetchNotifications();

      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification._id);
    router.push(notification.redirectUrl);
    setIsOpen(false);
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

  if (!session) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-800 transition-colors"
      >
        <FaBell className="text-white text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute -right-28 mt-2 w-98 sm:w-96 bg-gray-200 rounded-lg shadow-xl z-50 max-h-[700px] overflow-hidden border border-gray-300">
          <div className="p-4 border-b border-gray-300 bg-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-800 font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto max-h-[400px] bg-gray-200">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-600">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => {
                const isRead = getReadNotifications().includes(
                  notification._id,
                );
                const daysRemaining = getDaysRemaining(notification.createdAt);

                return (
                  <div
                    key={notification._id}
                    className={`border-b border-gray-300 hover:bg-gray-300 transition-colors cursor-pointer ${
                      !isRead ? "bg-gray-100" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-gray-800 font-semibold mb-1">
                            {notification.title}
                            {!isRead && (
                              <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </h4>
                          <p className="text-gray-700 text-sm mb-2">
                            {notification.body}
                          </p>
                          <div className="flex justify-between items-center">
                            <p className="text-gray-500 text-xs">
                              {new Date(
                                notification.createdAt,
                              ).toLocaleDateString()}{" "}
                              at{" "}
                              {new Date(
                                notification.createdAt,
                              ).toLocaleTimeString()}
                            </p>
                            {daysRemaining <= 2 && (
                              <p className="text-xs text-red-500">
                                Expires in {daysRemaining} day
                                {daysRemaining !== 1 ? "s" : ""}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
