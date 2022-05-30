import { useRef } from 'react';

const useDebounceFunc = (fn: Function, ms: number) => {
  const timerRef = useRef<NodeJS.Timeout | null>();
  const resFunc = (...args: any) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      fn(...args);
      timerRef.current = null;
    }, ms);
  };

  return resFunc;
};

export default useDebounceFunc;
