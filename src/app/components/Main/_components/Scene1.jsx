import * as THREE from "three";

const Scene1 = ({ scene }) => {
  scene.background = new THREE.Color("#ffffff");

  return (
    <group>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={0xff0000} />
      </mesh>
    </group>
  );
};

export default Scene1;
