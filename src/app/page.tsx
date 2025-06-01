import React from "react";
import { HeroSectionOne } from "../../components/Hero";
import { PointerHeading } from "../../components/PointerHeading";
import { HeroScroll } from "../../components/Hero2";
import { Howto } from "../../components/HowTo";
import Footer from "../../components/Footer";
import Contact from "../../components/Contact";
import Showreel from "../../components/ShowReel";

const Page = () => {
  return (
    <div className="bg-black">
      <HeroSectionOne />
      <Showreel />
      <PointerHeading />
      <Howto />
      <HeroScroll />
      <Contact />
      <Footer />
    </div>
  );
};

export default Page;
