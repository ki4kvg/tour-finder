export const fetchWithRetry = async <T>(fn: () => Promise<T>, retries = 2): Promise<T> => {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.warn(`Retry attempt ${i + 1} failed`);
    }
  }
  throw lastError;
};
