import { useEffect, useState } from "react";

const useDimensions = () => {
  const [dimensions, setDimensions] = useState({
    windowWidth: 0,
    windowHeight: 0,
  });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return dimensions;
};

export default useDimensions;
