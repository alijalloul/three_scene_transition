import gsap from "gsap";
import { useControls } from "leva";
import { Suspense, useEffect } from "react";
import * as THREE from "three";

import { Preload } from "@react-three/drei";
import CameraMouse from "./Camera";
import Ground from "./Ground";
import Head from "./Head";
import Lights from "./Lights";
import Logo from "./Logo";

const Scene1 = ({ camera, scene }) => {
  const { backgroundColor, fogColor, enableGround } = useControls(
    "Environment",
    {
      backgroundColor: "#d0d0d0",
      fogColor: "#d0d0d0",
      fogFar: { value: 12, min: 0, max: 12 },
      enableGround: true,
    }
  );

  const isSmallDevice =
    typeof window !== "undefined"
      ? window.innerWidth < 768
        ? true
        : false
      : false;

  const headPosition = useControls("Head position", {
    x: 0,
    y: -0.8,
    z: 0,
    cloudColor: "#ffffff",
  });

  useEffect(() => {
    scene.background = new THREE.Color("#d0d0d0");
    scene.fog = new THREE.Fog("#d0d0d0", 3, 12);

    gsap.to(scene.fog, {
      far: isSmallDevice ? 10 : 8,
      ease: "power4.inOut",
      duration: 2.3,
      delay: 0.9,
    });
  });

  return (
    <group>
      <Lights />
      <CameraMouse camera={camera} />

      <Suspense>
        <Preload all />
        <Head position={[headPosition.x, headPosition.y, headPosition.z]} />
        <Logo />
      </Suspense>

      {enableGround && <Ground />}
    </group>
  );
};

export default Scene1;
