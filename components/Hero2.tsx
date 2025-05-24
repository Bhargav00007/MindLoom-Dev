"use client";
import React from "react";
import { ContainerScroll } from "../components/ui/container-scroll-animation";

export function HeroScroll() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="lg:text-4xl text-2xl font-semibold text-white">
              Unleash your creativity with
              <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                MindLoom Blogs
              </span>
            </h1>
          </>
        }
      >
        <div className="relative h-[720px] w-full">
          <img
            src="/illus.png"
            alt="hero"
            className="absolute top-[-80px] left-0 w-full h-full object-cover object-left-top rounded-2xl items-center justify-center"
            draggable={false}
          />
        </div>
      </ContainerScroll>
    </div>
  );
}
