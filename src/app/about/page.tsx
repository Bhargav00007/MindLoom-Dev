import React from "react";
import { PointerHighlight } from ".././../../components/ui/pointer-highlight";
import Footer from "../../../components/Footer";

const About = () => {
  return (
    <>
      <div className="lg:my-10 lg:mx-36 mx-5 my-5">
        <div className=" max-w-lg pb-5 text-2xl font-bold tracking-tight md:text-4xl">
          Introducing
          <PointerHighlight
            rectangleClassName="bg-neutral-400 border-neutral-400"
            pointerClassName="text-yellow-500"
          >
            <span className="relative z-10">MindLoom Blogs</span>
          </PointerHighlight>
        </div>

        <p className="lg:text-xl text-lg mt-5 first-letter:text-4xl">
          MindLoom Blogs is a space where ideas come to life. Whether you're a
          writer, thinker, or just someone with a story to share, our platform
          helps you turn your thoughts into engaging content. With easy-to-use
          tools and a supportive community, MindLoom makes blogging simple,
          enjoyable, and meaningful. Start creating today and let your voice be
          heard.
        </p>

        <h1 className="lg:text-4xl text-2xl font-bold underline decoration-neutral-500 mt-10 lg:mt-20">
          How To Use MindLoom Blogs
        </h1>
        <h1 className="lg:text-2xl text-xl font-bold underline decoration-sky-500 mt-5">
          Sign In
        </h1>
        <p className="lg:text-xl text-lg mt-1 ">
          Sign In to MindLoom Blogs using your Google, GitHub, or LinkedIn
          account. If you don't have an account, you can create one easily.
          <br />
          <br /> Click on the "Sign In" button on the top right corner of the
          page.
        </p>
        <h1 className="lg:text-2xl text-xl font-bold underline decoration-sky-500 mt-5">
          Create
        </h1>
        <p className="lg:text-xl text-lg mt-1 ">
          After signing in, you can create a new blog post by clicking on the
          "Create" button on the Navbar. You can write your blog post using the
          rich text editor, which supports various formatting options like bold,
          italic, headings, lists, and more. You can also add images to your
          blog post by clicking on the image icon in the editor toolbar.
          <br />
          <br /> Click on the "Create Blog" button after creating your blog
          post. Your blog post will be saved and published on the platform.
        </p>
        <h1 className="lg:text-2xl text-xl font-bold underline decoration-sky-500 mt-5">
          Delete
        </h1>
        <p className="lg:text-xl text-lg mt-1 ">
          You can delete your blog post by clicking on the "Delete" button in
          your profile icon on the top navbar
          <br />
          <br /> Click on the "Delete" button on the post you feel like
          removing.
        </p>
        <h1 className="lg:text-2xl text-xl font-bold underline decoration-sky-500 mt-5">
          Follow
        </h1>
        <p className="lg:text-xl text-lg mt-1 ">
          You can follow other creators whose blogs you enjoy by clicking the
          "Follow" button on their profile. This helps you stay updated with
          their latest posts on your personalized feed.
          <br />
          <br />
          Click on the "Following" tab to explore blogs from people you follow.
        </p>

        <h1 className="lg:text-2xl text-xl font-bold underline decoration-sky-500 mt-5">
          Like
        </h1>
        <p className="lg:text-xl text-lg mt-1 ">
          Found a blog you loved? Show appreciation by clicking the "Like"
          button on the post. It's a simple way to support creators and
          highlight great content.
          <br />
          <br />
          The number of likes reflects a post&apos;s popularity.
        </p>

        <h1 className="lg:text-2xl text-xl font-bold underline decoration-sky-500 mt-5">
          Comment
        </h1>
        <p className="lg:text-xl text-lg mt-1 ">
          Join the conversation! Add your thoughts, feedback, or questions by
          leaving a comment on any blog post.
          <br />
          <br />
          Click on the "Comment" section below the post to start engaging with
          others.
        </p>

        <h3 className="lg:text-4xl text-2xl font-bold underline decoration-neutral-500 mt-10 lg:mt-20">
          Tech Used (Packages/Libraries)
        </h3>
        <ul
          role="list"
          className="marker:text-neutral-400 list-disc pl-5 space-y-3 lg:text-xl text-lg mt-5"
        >
          <li>Next.js</li>
          <li>Tailwind CSS</li>
          <li>MongoDB</li>
          <li>TypeScript</li>
          <li>Flowbite</li>
          <li>Aceternity UI</li>
          <li>Framer Motion</li>
          <li>Mongoose</li>
          <li>NextAuth</li>
          <li>Next.js Toploader</li>
          <li>React Icons</li>
          <li>React Spinners</li>
          <li>TipTap</li>
        </ul>

        <h1 className="lg:text-4xl text-2xl font-bold underline decoration-neutral-500 mt-10 lg:mt-20">
          About Me
        </h1>
        <p className="lg:text-xl text-lg mt-5">
          Heyaaa! Bhargav Pattanayak here..... Connect with me on LinkedIn or
          github
        </p>
      </div>
      <div className="bg-black">
        <Footer />
      </div>
    </>
  );
};

export default About;
