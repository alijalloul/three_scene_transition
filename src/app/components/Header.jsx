import gsap from "gsap";
import { useEffect, useRef } from "react";

import LogoIcon from "./LogoIcon";

import { useScrambleText } from "@/utils/useScrambleText";

const Header = ({ color = "black" }) => {
  const refs = {
    experience: useRef(),
    about: useRef(),
    intro: useRef(),
    talk: useRef(),
    menu: useRef(),
    available: useRef(),
  };

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { duration: 1, ease: "power4.inOut" },
    });

    tl.to(
      "#logo-fit",
      {
        opacity: 1,
        ease: "power4.inOut",
        duration: 0.5,
      },
      0
    );

    tl.to(
      "#dot",
      {
        opacity: 1,
        ease: "power4.inOut",
        duration: 0.5,
      },
      0
    );

    tl.add(() => useScrambleText(refs.experience.current, "Experience", 1), 0);
    tl.add(() => useScrambleText(refs.about.current, "About Me", 1), 0);
    tl.add(
      () =>
        useScrambleText(
          refs.intro.current,
          "I’m Kirilo, a product designer with 5 years of experience crafting innovative, immersive digital experiences.",
          1
        ),
      0
    );
    tl.add(() => useScrambleText(refs.talk.current, "Let's talk", 1), 0);
    tl.add(() => useScrambleText(refs.menu.current, "Menu", 1), 0);
    tl.add(
      () =>
        useScrambleText(refs.available.current, "Available For Freelance", 1),
      0
    );
  });

  return (
    <header
      className="w-full fixed top-0  p-4 lg:p-6 h-fit flex justify-between"
      style={{ color: color }}
    >
      <div className=" gap-20 items-center">
        <div
          id="logo-fit"
          className="absolute left-[16px] lg:left-[24px] top-[16px] lg:top-[24px] w-[62px] h-[52px] opacity-0"
        >
          <LogoIcon color={color} />
        </div>

        <div className="flex-col gap-2 absolute hidden lg:flex lg:left-[144px] top-[16px] lg:top-[24px]">
          <span className="overflow-hidden">
            <a
              // href="/cv"
              className="link text-base block underline underline-offset-4 "
            >
              <span ref={refs.experience} className="block"></span>
            </a>
          </span>
          <span className="overflow-hidden">
            <a
              href="https://github.com/thomasgertenbach"
              target="_blank"
              rel="noreferrer"
              className="link text-base block underline underline-offset-4"
            >
              <span ref={refs.about} className="block"></span>
            </a>
          </span>
        </div>
        <p
          id="text"
          className="leading-6 max-w-[450px] hidden lg:block absolute lg:left-[274px] lg:top-[24px] top-[90px]"
        >
          <span ref={refs.intro} className="block"></span>
        </p>
      </div>
      <div className="flex flex-col gap-2  items-end">
        <span className="overflow-hidden">
          <button
            // onClick={() => {navigate("/contact")}}
            className="text-base hidden lg:block third underline underline-offset-4"
          >
            <span ref={refs.talk} className="block"></span>
          </button>
          <button
            href="https://github.com/thomasgertenbach"
            target="_blank"
            rel="noreferrer"
            className="text-sm third lg:hidden underline underline-offset-4"
          >
            <span ref={refs.menu} className="block"></span>
          </button>
        </span>
        <span className="overflow-hidden">
          <p className="flex gap-3 items-center third text-sm lg:text-base">
            <span ref={refs.available} className="block"></span>

            <span
              id="dot"
              className="w-2 h-2 opacity-0 rounded-full"
              style={{ backgroundColor: color }}
            />
          </p>
        </span>
      </div>
    </header>
  );
};

export default Header;
