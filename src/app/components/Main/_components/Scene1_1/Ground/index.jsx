import { useTexture } from "@react-three/drei";
import gsap from "gsap";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material";

import { useStore } from "@/store";
import { useFrame } from "@react-three/fiber";
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";

import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Ground() {
  const groundRef = useRef();

  const [floor, normal, roughnessMap] = useTexture([
    "/images/floor.jpg",
    "/images/normal.png",
    "/images/roughness.jpg",
  ]);
  const HPI = Math.PI / 2;

  const { isLogoLoaded } = useStore();

  floor.wrapS = floor.wrapT = THREE.RepeatWrapping;
  normal.wrapS = normal.wrapT = THREE.RepeatWrapping;
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;

  const materialRef = useRef();

  floor.repeat.set(3, 3);
  normal.repeat.set(3, 3);
  roughnessMap.repeat.set(3, 3);

  const { floorColor } = useControls("Environment", {
    floorColor: "#FFFFFF",
  });

  const { uRevealProgress } = useControls("Environment", {
    uRevealProgress: { value: 0, min: 0, max: 3 },
  });

  const uniforms = {
    uTime: new THREE.Uniform(0),
    uRevealProgress: new THREE.Uniform(uRevealProgress),
    glitchScale: new THREE.Uniform(1),
    uRevealProgress: new THREE.Uniform(uRevealProgress),
  };

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  useEffect(() => {
    if (isLogoLoaded) {
      if (materialRef.current) {
        gsap.to(materialRef.current.uniforms.uRevealProgress, {
          value: 2,
          duration: 3,
          ease: "power4.inOut",
          delay: 1,
        });
      }
    }
  }, [isLogoLoaded]);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        end: 800,
        markers: false,
        scrub: true,
        toggleActions: "play reverse play reverse",
      },
    });

    tl.fromTo(
      groundRef.current.rotation,
      {
        y: 0,
        ease: "power4.inOut",
      },
      {
        y: Math.PI / 4,
        ease: "power4.inOut",
      },
      "<"
    );

    return () => {
      tl.kill();
    };
  });

  return (
    <group>
      <mesh
        position={[0, -0.9, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        ref={groundRef}
      >
        <planeGeometry args={[10, 10, 512, 512]} />
        <CustomShaderMaterial
          ref={materialRef}
          baseMaterial={THREE.MeshStandardMaterial}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          map={floor}
          color={floorColor}
          normalMap={normal}
          roughness={0.1}
          transparent
        />
      </mesh>
    </group>
  );
}

export default Ground;
