import { Plane, shaderMaterial, useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";

import { useStore } from "@/store";
import useDimensions from "@/utils/useDimensions";
import { extend, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";

const LogoShader = shaderMaterial(
  {
    uTime: 0,
    uTexture: undefined,
    uRevealProgress: 0,
    uRevealProgressAfter: 1,
    uLogoColor: new THREE.Color("#161314"),
  },
  vertexShader,
  fragmentShader
);

extend({ LogoShader });

const Logo = () => {
  const logoTexture = useTexture("/images/image.webp");
  const shaderRef = useRef();

  const { setIsLogoLoaded } = useStore();

  const { windowHeight } = useDimensions();
  const isSmallDevice = windowHeight < 768 ? true : false;

  useFrame((state, delta) => {
    shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { duration: 1, ease: "power4.inOut" },
    });

    tl.to(shaderRef.current.uniforms.uRevealProgress, {
      duration: 2.5,
      ease: "power4.inOut",
      value: 1,
    });

    tl.to(shaderRef.current.uniforms.uRevealProgressAfter, {
      duration: 1.5,
      ease: "power2.inOut",
      value: 0,
    });

    tl.add(() => {
      setIsLogoLoaded(true);
    }, "<");
  });

  return (
    <Plane
      args={[isSmallDevice ? 1.2 : 1.7, isSmallDevice ? 1.2 : 1.7, 500, 500]}
      position={[0, 1, 3]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <logoShader
        transparent
        key={LogoShader.key}
        uTexture={logoTexture}
        ref={shaderRef}
      />
    </Plane>
  );
};

export default Logo;
