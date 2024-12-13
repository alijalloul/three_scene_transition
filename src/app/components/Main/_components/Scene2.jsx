import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

const Scene2 = () => {
  const { scene } = useGLTF("/models/monkey.glb");

  console.log("scene: ", scene);

  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffffff"];
  const { viewport } = useThree();

  return (
    <group>
      {/* {colors.map((color, index) => (
        <group
          key={index}
          name={index}
          scale={0.5}
          position={[viewport.width * index, 0, 0]}
          dispose={null}
        >
          <primitive object={scene.clone()} />
          </group>
      ))} */}

      <primitive object={scene.clone()} />
    </group>
  );
};

export default Scene2;
