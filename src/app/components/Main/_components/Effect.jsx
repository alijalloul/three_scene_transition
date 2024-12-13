import { EffectComposer, ToneMapping } from "@react-three/postprocessing";

const Effect = () => {
  return (
    <EffectComposer>
      <ToneMapping />
    </EffectComposer>
  );
};

export default Effect;
