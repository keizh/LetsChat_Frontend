import { useState, useRef, useEffect } from "react";

const useThrottle = (val: string, CB: () => void, delay: number) => {
  const [throttledValue, setTV] = useState(val);
  const isActive = useRef(false);
  const lastArg = useRef<string | null>(null);

  useEffect(() => {
    if (isActive.current == false && (val != "" || val != throttledValue)) {
      isActive.current = true;
      setTV(val);
      CB();
      setTimeout(() => {
        if (lastArg.current != null) {
          setTV(lastArg.current);
          CB();
        }
        isActive.current = false;
      }, delay);
    } else {
      lastArg.current = val;
    }
  }, [val, CB, delay, throttledValue]);

  return throttledValue;
};

export default useThrottle;
