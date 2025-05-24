import React from "react";
import { HeroSectionOne } from "../../components/Hero";
import { PointerHeading } from "../../components/PointerHeading";
import { HeroScroll } from "../../components/Hero2";
import { Howto } from "../../components/HowTo";
import Footer from "../../components/Footer";
import Contact from "../../components/Contact";

const Page = () => {
  return (
    <div className="bg-black">
      <HeroSectionOne />
      <PointerHeading />
      <Howto />
      <HeroScroll />
      <Contact />
      <Footer />
    </div>
  );
};

export default Page;
