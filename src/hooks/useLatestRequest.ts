import { useRef } from 'react';

export function useLatestRequestGuard() {
  const seq = useRef(0);

  const invalidate = () => {
    seq.current += 1;
  };

  const runWithGuard = async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
    const currentSeq = ++seq.current;

    try {
      const result = await fn();

      if (currentSeq !== seq.current) return undefined;

      return result;
    } catch (err) {
      if (currentSeq !== seq.current) return undefined;
      throw err;
    }
  };

  return { runWithGuard, invalidate };
}
