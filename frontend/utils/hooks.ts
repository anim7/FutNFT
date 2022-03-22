import { useRef } from "react";

export const useConstructor = (callback: () => void) => {
  const constructorHasRun = useRef(false);
  if (constructorHasRun.current) return;
  callback();
  constructorHasRun.current = true;
};
