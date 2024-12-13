"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

import { useScrambleText } from "@/utils/useScrambleText";

const TitleMarquee = ({ color = "black" }) => {
  const ref = useRef();

  useEffect(() => {
    const timeline1 = gsap.timeline();

    timeline1.call(() =>
      useScrambleText(
        ref.current,
        "Kirilo Sztarcsak Kirilo Sztarcsak Kirilo Sztarcsak",
        1
      )
    );

    const timeline2 = gsap.timeline({
      repeat: -1,
      defaults: { ease: "none" },
    });

    timeline2
      .to(ref.current, { xPercent: -100 / 3, duration: 10 })
      .set([ref.current], { xPercent: 0 });

    return () => {
      timeline1.kill();
      timeline2.kill();
    };
  });

  return (
    <div
      className="flex pointer-events-none fixed bottom-8 items-end "
      style={{ color: color }}
    >
      <h4
        ref={ref}
        className="opacity-100 leading-[140px] whitespace-nowrap text-[200px] font-medium mx-4  uppercase"
      ></h4>
    </div>
  );
};

export default TitleMarquee;
