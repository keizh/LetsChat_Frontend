import { useState, useEffect, useRef } from "react";

const useDebounce = (
  value: string,
  CB: (val: string) => void,
  delay: number = 500
): string => {
  const [DV, setDV] = useState<string>(value);
  const timer = useRef<null | number>(null);

  useEffect(() => {
    if (value != "" || DV != value) {
      timer.current = setTimeout(() => {
        setDV(value);
        CB(value);
      }, delay);
    }

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value]);

  return DV;
};

export default useDebounce;
