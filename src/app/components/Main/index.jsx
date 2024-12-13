import { shaderMaterial, useFBO } from "@react-three/drei";
import { createPortal, extend, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";

import useDimensions from "@/utils/useDimensions";
import Scene1 from "./_components/Scene1_1";
import Scene2 from "./_components/Scene2_2";
import Scene3 from "./_components/Scene3";

import ScrollTrigger from "gsap/ScrollTrigger";
import Effect from "./_components/Effect";

gsap.registerPlugin(ScrollTrigger);

const TransitionMaterial = shaderMaterial(
  {
    uTexture1: undefined,
    uTexture2: undefined,
    uTexture3: undefined,
    progress: 0,
    time: 0,
  },
  vertexShader,
  fragmentShader
);

extend({ TransitionMaterial });

const Main = () => {
  const { windowWidth, windowHeight } = useDimensions();

  const { viewport, gl, clock } = useThree();
  const screenMesh = useRef();

  const scene1 = useMemo(() => new THREE.Scene());
  const scene2 = useMemo(() => new THREE.Scene());
  const scene3 = useMemo(() => new THREE.Scene());

  const camera1 = useMemo(
    () => new THREE.PerspectiveCamera(35, windowWidth / windowHeight, 0.1, 1000)
  );
  camera1.position.set(0, 0, 5);

  const camera2 = useMemo(
    () => new THREE.PerspectiveCamera(35, windowWidth / windowHeight, 0.1, 1000)
  );
  camera2.position.set(0, 0, 5);

  const camera3 = useMemo(
    () => new THREE.PerspectiveCamera(35, windowWidth / windowHeight, 0.1, 1000)
  );

  camera3.position.set(0, 0, 5);

  const renderTarget1 = useFBO();
  const renderTarget2 = useFBO();
  const renderTarget3 = useFBO();

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        start: "top top",
        end: windowHeight * (6 - 1),
        markers: false,
        scrub: true,
      },
    });

    tl.to(screenMesh.current.material.uniforms.progress, {
      value: 1,
      ease: "none",
      onUpdate: () => {
        console.log(
          "progress: ",
          screenMesh.current.material.uniforms.progress.value
        );
      },
    });

    return () => {
      tl.kill();
    };
  });

  useFrame((state) => {
    gl.setRenderTarget(renderTarget1);
    gl.render(scene1, camera1);

    gl.setRenderTarget(renderTarget2);
    gl.render(scene2, camera2);

    gl.setRenderTarget(renderTarget3);
    gl.render(scene3, camera3);

    screenMesh.current.material.uniforms.uTexture1.value =
      renderTarget1.texture;
    screenMesh.current.material.uniforms.uTexture2.value =
      renderTarget2.texture;
    screenMesh.current.material.uniforms.uTexture3.value =
      renderTarget3.texture;
    screenMesh.current.material.uniforms.time.value = clock.elapsedTime;

    gl.setRenderTarget(null);
  });

  return (
    <>
      {createPortal(<Scene1 camera={camera1} scene={scene1} />, scene1)}
      {createPortal(<Scene2 scene={scene2} />, scene2)}
      {createPortal(<Scene3 />, scene3)}

      <mesh ref={screenMesh} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry />
        <transitionMaterial transparent />
      </mesh>

      <Effect />
    </>
  );
};

export default Main;
