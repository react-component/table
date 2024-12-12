import { useState, useEffect, useCallback } from 'react';

function useResolve(loadFunction) {
  const [data, setData] = useState(null);
  const [resolve, setResolve] = useState(false);

  const stableLoadFunction = useCallback(loadFunction, []);

  useEffect(() => {
    if (stableLoadFunction) {
      stableLoadFunction().then(result => {
        setData(result);
        setResolve(true);
      });
    }
  }, [stableLoadFunction]);

  return { data, resolve };
}

export default useResolve;
