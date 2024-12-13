"use client";

import { MeshDiscardMaterial, useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap, { Power4 } from "gsap";
import { useControls } from "leva";
import { easing } from "maath";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

import { useStore } from "@/store";
import headFragmentShader from "./shaders/headShaders/fragment.glsl";
import headVertexShader from "./shaders/headShaders/vertex.glsl";
import ornamentFragmentShader from "./shaders/ornamentShaders/fragment.glsl";
import ornamentVertexShader from "./shaders/ornamentShaders/vertex.glsl";

const Head = ({ position }) => {
  const { nodes } = useGLTF("/models/head.glb");
  const mousePosition = useRef([0, 0, 0]);
  const uProgress = useRef(0);
  const [shadowMap] = useTexture([
    "/images/shadow-map.jpg",
    "/images/matcap-plastic.jpg",
  ]);
  const { isLogoLoaded } = useStore();
  const { isHeadLoaded, setIsHeadLoaded } = useStore();

  const materialRef = useRef();
  const meshRef = useRef();
  const hairRef = useRef();
  const hairMaterialRef = useRef();

  shadowMap.flipY = false;

  const { headColor, ornamentColor, useMatCap } = useControls("Head", {
    headColor: "#ffffff",
    ornamentColor: "#c4c4c4",
    useMatCap: true,
  });

  const {
    uMinCrackWidth,
    uMaskStrength,
    uRevealProgress,
    uTargetBias,
    uMaxCrackWidth,
    uCrackSpeed,
    uCrackFrequency,
    uRadius,
    uCrackColor,
    uMaskFrequency,
    uMaskSpeed,
  } = useControls("Cracks", {
    uMinCrackWidth: { value: 0.03, min: 0, max: 0.1 },
    uMaxCrackWidth: { value: 0.04, min: 0, max: 0.1 },
    uCrackSpeed: { value: 2.6, min: 0, max: 5 },
    uCrackFrequency: { value: 2.15, min: 0, max: 5 },
    uRadius: { value: 0.74, min: 0, max: 3 },
    uTargetBias: { value: 0, min: 0, max: 1 },
    uCrackColor: "#000000",
    uMaskStrength: { value: 1, min: 0, max: 1 },
    uMaskFrequency: { value: 0, min: 0, max: 60 },
    uMaskSpeed: { value: 0, min: 0, max: 10 },
    uRevealProgress: { value: 0, min: 0, max: 1 },
  });

  const uniforms = {
    uTime: new THREE.Uniform(0),
    uMouse: { value: new THREE.Vector3(0.0, 0.0, 0.0) },

    uMinCrackWidth: new THREE.Uniform(uMinCrackWidth),
    uMaxCrackWidth: new THREE.Uniform(uMaxCrackWidth),
    uCrackSpeed: new THREE.Uniform(uCrackSpeed),
    uCrackFrequency: new THREE.Uniform(uCrackFrequency),
    uRadius: new THREE.Uniform(uRadius),
    uCrackColor: new THREE.Uniform(new THREE.Color(uCrackColor)),
    uTargetBias: new THREE.Uniform(uTargetBias),
    uMaskStrength: new THREE.Uniform(uMaskStrength),
    uMaskFrequency: new THREE.Uniform(uMaskFrequency),
    uMaskSpeed: new THREE.Uniform(uMaskSpeed),
    glitchScale: new THREE.Uniform(1),
    uRevealProgress: new THREE.Uniform(uRevealProgress),
    uCracksOpacity: new THREE.Uniform(0),
    progress: new THREE.Uniform(uProgress.current),

    _F_0: new THREE.Uniform(7.0),
    _omega_0: new THREE.Uniform(0.1),
    _omega_w: new THREE.Uniform(0.1),
    _F_w: new THREE.Uniform(0.4),
    _a: new THREE.Uniform(6.0),
    Seed: new THREE.Uniform(4),
  };

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

      easing.damp3(
        materialRef.current.uniforms.uMouse.value,
        new THREE.Vector3(
          mousePosition.current[0],
          mousePosition.current[1],
          mousePosition.current[2]
        ),
        0.3,
        delta
      );

      materialRef.current.uniforms.uMinCrackWidth.value = uMinCrackWidth;
      materialRef.current.uniforms.uMaxCrackWidth.value = uMaxCrackWidth;
      materialRef.current.uniforms.uCrackSpeed.value = uCrackSpeed;
      materialRef.current.uniforms.uCrackFrequency.value = uCrackFrequency;
      materialRef.current.uniforms.uRadius.value = uRadius;
      materialRef.current.uniforms.uCrackColor.value = new THREE.Color(
        uCrackColor
      );
      materialRef.current.uniforms.uTargetBias.value = uTargetBias;
      materialRef.current.uniforms.uMaskStrength.value = uMaskStrength;
      materialRef.current.uniforms.uMaskFrequency.value = uMaskFrequency;
      materialRef.current.uniforms.uMaskSpeed.value = uMaskSpeed;
      materialRef.current.uniforms.progress.value = uProgress.current;
    }

    if (hairMaterialRef.current) {
      hairMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.geometry = mergeVertices(meshRef.current.geometry);
      meshRef.current.geometry.computeTangents();
    }
    if (hairRef.current) {
      hairRef.current.geometry = mergeVertices(hairRef.current.geometry);
      hairRef.current.geometry.computeTangents();
    }
  });

  useEffect(() => {
    if (isLogoLoaded) {
      if (materialRef.current) {
        gsap
          .timeline()
          .to(materialRef.current.uniforms.uRevealProgress, {
            duration: 3,
            ease: Power4.easeInOut,
            value: 1,
            delay: 1,
          })
          .add(() => {
            setIsHeadLoaded(true);
          }, ">");
      }
    }
  }, [isLogoLoaded]);

  const [hovered, setHovered] = useState(true);

  useEffect(() => {
    if (materialRef.current) {
      gsap.to(materialRef.current.uniforms.uCracksOpacity, {
        duration: 1,
        ease: Power4.easeInOut,
        value: hovered ? 1 : 0,
      });
    }
  }, [hovered]);

  const ornamentRef = useRef();

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        start: "start start",
        end: 5000,
        markers: false,
        scrub: 1,
        onUpdate: ({ progress }) => {
          uProgress.current = progress;
        },
      },
    });
  });

  return (
    <group frustumCulled={false} position={position} dispose={null}>
      <mesh
        onPointerOver={(e) => {
          setHovered(true);
        }}
        onPointerOut={(e) => {
          setHovered(false);
        }}
        frustumCulled={false}
        onPointerMove={(e) => {
          if (meshRef.current) {
            mousePosition.current = [e.point.x, e.point.y, e.point.z];
          }
        }}
        geometry={nodes["low-res-face"].geometry}
      >
        <MeshDiscardMaterial />
      </mesh>

      <mesh frustumCulled={false} ref={meshRef} geometry={nodes.head.geometry}>
        <CustomShaderMaterial
          ref={materialRef}
          baseMaterial={THREE.MeshStandardMaterial}
          vertexShader={headVertexShader}
          fragmentShader={headFragmentShader}
          uniforms={uniforms}
          transparent
          // map={shadowMap}
          // lightMapIntensity={1}
          color={headColor}
          roughness={0.9}
        />
        {/* <meshStandardMaterial /> */}
      </mesh>

      {/* <directionalLight
        ref={lightRef1}
        position={[-0.5, 0, 0]}
        intensity={0.5}
        target={ornamentRef.current}
      />
      <directionalLight
        ref={lightRef2}
        position={[0.5, 0, 0]}
        intensity={0.5}
        target={ornamentRef.current}
      /> */}

      <mesh
        ref={ornamentRef}
        frustumCulled={false}
        geometry={nodes.Ornament005.geometry}
      >
        <CustomShaderMaterial
          ref={hairMaterialRef}
          baseMaterial={THREE.MeshStandardMaterial}
          vertexShader={ornamentVertexShader}
          fragmentShader={ornamentFragmentShader}
          uniforms={uniforms}
          color={ornamentColor}
          metalness={1}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
};

export default Head;

useGLTF.preload("/models/head.glb");
