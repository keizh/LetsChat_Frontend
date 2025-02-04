import { useState, useEffect } from "react";

const useWindow = (): { x: number; y: number } => {
  const [dimen, setDimen] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });

  const handler = () => {
    setDimen({
      x: window.innerWidth,
      y: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  return dimen;
};

export default useWindow;
