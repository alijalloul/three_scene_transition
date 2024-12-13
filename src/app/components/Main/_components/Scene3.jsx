const Scene3 = () => {
  return (
    <group>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={0x0000ff} />
      </mesh>
    </group>
  );
};

export default Scene3;
