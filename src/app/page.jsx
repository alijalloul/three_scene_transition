"use client";

import useDimensions from "@/utils/useDimensions";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Header from "./components/Header";
import Main from "./components/Main";
import TitleMarquee from "./components/TitleMarquee";

export default function Home() {
  const { windowWidth, windowHeight } = useDimensions();

  return (
    <div style={{ height: windowHeight * 6 }}>
      <div className="w-screen h-screen fixed">
        <Canvas className="bg-[#161314]">
          <PerspectiveCamera position={[0, 0, 5]} />
          <Environment preset="city" />

          <Main />
        </Canvas>

        <Header color="white" />
        <TitleMarquee color="white" />
      </div>
    </div>
  );
}
