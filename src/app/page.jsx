"use client";

import useDimensions from "@/utils/useDimensions";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import TitleMarquee from "./components/TitleMarquee";

import ScrollTrigger from "gsap/ScrollTrigger";
import { Leva } from "leva";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { windowHeight } = useDimensions();

  const [color, setColor] = useState("black");

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        start: "top top",
        end: windowHeight / 2,
        markers: false,
        scrub: true,
        onLeave: () => {
          setColor("white");
        },
        onEnterBack: () => {
          setColor("black");
        },
      },
    });
  });

  return (
    <div style={{ height: windowHeight * 6 }}>
      <div className="w-screen h-screen fixed">
        <Canvas className="bg-[#161314]">
          <PerspectiveCamera position={[0, 0, 5]} />
          <Environment preset="city" />

          <Main />
        </Canvas>

        <Header color={color} />
        <TitleMarquee color={color} />

        <Leva collapsed hidden />
      </div>
    </div>
  );
}
