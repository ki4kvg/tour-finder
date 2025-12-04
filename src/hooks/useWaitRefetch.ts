import { useEffect, useRef } from 'react';
import { fetchWithRetry } from '@/helpers/fetchWithRetry.ts';

function useWaitAndRefetch(waitUntil: string | null, onError: () => void, fetchFn: () => Promise<void>) {
  const prevWaitUntil = useRef<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!waitUntil || prevWaitUntil.current === waitUntil) return;

    prevWaitUntil.current = waitUntil;

    const waitUntilTs = new Date(waitUntil).getTime();
    const now = Date.now();
    const delay = waitUntilTs - now;

    if (delay <= 0) {
      runFetch();
      return;
    }

    timeoutRef.current = setTimeout(() => {
      runFetch();
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    async function runFetch() {
      try {
        await fetchWithRetry(fetchFn, 2);
      } catch (error) {
        console.error('Fetching prices failed', error);
        onError();
      }
    }
  }, [waitUntil, fetchFn, onError]);
}

export default useWaitAndRefetch;
