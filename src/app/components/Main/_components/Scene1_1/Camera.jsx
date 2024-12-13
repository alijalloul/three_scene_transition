"use client";

import { useStore } from "@/store";
import { useFrame } from "@react-three/fiber";
import gsap, { Power3 } from "gsap";
import { easing } from "maath";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const CameraMouse = ({ camera }) => {
  const { isLogoLoaded } = useStore();
  const lookAt = useRef(new THREE.Vector3(0, 0, 3));
  const [cameraAnimationDone, setCameraAnimationDone] = useState(false);
  const isSmallDevice =
    typeof window !== "undefined"
      ? window.innerWidth < 768
        ? true
        : false
      : false;
  const loadedZValues = useRef({ value: isSmallDevice ? 5 : 4 });

  useEffect(() => {
    if (isLogoLoaded) {
      gsap.to(camera.position, {
        y: isSmallDevice ? 0.15 : 0,
        x: 0,
        z: isSmallDevice ? 5 : 4,
        duration: 3.5,
        delay: 0.3,
        ease: Power3.easeInOut,
        onComplete: () => {
          setCameraAnimationDone(true);
        },
      });

      gsap.to(lookAt.current, {
        y: isSmallDevice ? 0.15 : 0,
        x: 0,
        z: 0,
        duration: 3.5,
        delay: 0.3,
        ease: Power3.easeInOut,
      });
    }
  }, [isLogoLoaded]);

  useEffect(() => {
    gsap.fromTo(
      loadedZValues.current,
      {
        value: isSmallDevice ? 5 : 4,
      },
      {
        value: 2,
        scrollTrigger: {
          start: "start start",
          end: "2000px center",
          markers: false,
          scrub: true,
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  useFrame((state, delta) => {
    if (cameraAnimationDone) {
      easing.damp3(
        camera.position,
        [
          -0 + -(state.pointer.x * state.viewport.width) / 10,
          -(-1 + state.pointer.y) / 8,
          loadedZValues.current.value,
        ],
        0.3,
        delta
      );
    }

    camera.lookAt(lookAt.current);
  });
};

export default CameraMouse;
