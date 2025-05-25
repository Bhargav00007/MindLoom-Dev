import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "../../components/SessionWrapper";
import Script from "next/script";
import { Navbar } from "../../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingProvider from "../../components/LoadingProvider";
import NextTopLoader from "nextjs-toploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MindLoom",
  description:
    " MindLoom Blogs is a space where ideas come to life. Whether you're a writer, thinker, or just someone with a story to share, our platform helps you turn your thoughts into engaging content. With easy-to-use tools and a supportive community, MindLoom makes blogging simple, enjoyable, and meaningful. Start creating today and let your voice be heard. ",
  icons: {
    icon: "/logonew.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pt-15`}
      >
        <SessionWrapper>
          <LoadingProvider>
            <NextTopLoader color="#a1a1a1" showSpinner={false} />

            <Navbar />
            {children}
          </LoadingProvider>
        </SessionWrapper>

        <Script
          src="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js"
          strategy="beforeInteractive"
        />

        <ToastContainer position="top-right" theme="dark" />
      </body>
    </html>
  );
}
