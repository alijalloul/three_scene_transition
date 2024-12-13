"use client";

import useDimensions from "@/utils/useDimensions";
import { Environment, Html, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const Scene2 = ({ scene }) => {
  scene.background = new THREE.Color("#161314");

  const { scene: monkeyScene } = useGLTF("/models/monkey.glb");

  const textRef = useRef(null);
  const projectsRefs = useRef([]);

  const [groupObject, setGroupObject] = useState(null);

  const { windowHeight } = useDimensions();

  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffffff"];

  const { viewport } = useThree();

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        start: windowHeight,
        end: `+=${windowHeight * (colors.length - 1)}`,
        markers: false,
        scrub: true,
        snap: 1 / (colors.length - 1),
        onUpdate: ({ progress }) => {
          const sectionNb = progress * (colors.length - 1);
          var fract;

          if (sectionNb !== Math.round(sectionNb)) {
            fract = sectionNb % 1;
          } else {
            fract = 1;
          }

          const opacity = 4 * Math.pow(fract, 2) - 4 * fract + 1;

          if (textRef) {
            textRef.current.style.opacity = opacity;
          }

          if (Math.ceil(opacity - 0.001) === 0) {
            textRef.current.innerText = `Project ${Math.round(sectionNb) + 1}`;
          }
        },
      },
    });
    if (groupObject) {
      tl.fromTo(
        groupObject.position,
        { x: 0, ease: "none" },
        {
          x: -viewport.width * (colors.length - 1),
          ease: "none",
        }
      );
    }

    return () => {
      tl.kill();
    };
  });

  return (
    <group>
      <Environment preset="city" />

      <group
        ref={(el) => {
          setGroupObject(el);
        }}
      >
        {colors.map((color, index) => (
          <group
            key={index}
            name={index}
            ref={(el) => {
              if (el) projectsRefs.current[index] = el;
            }}
            scale={0.5}
            position={[viewport.width * index, 0, 0]}
            dispose={null}
          >
            <primitive object={monkeyScene.clone()} />
          </group>
        ))}
      </group>

      <Html className=" pointer-events-none">
        <div className=" w-screen h-screen fixed z-10 -translate-x-1/2 -translate-y-1/2 text-white">
          <span ref={textRef} className="project_text absolute bottom-5 left-5">
            Project 1
          </span>
        </div>
      </Html>
    </group>
  );
};

export default Scene2;
