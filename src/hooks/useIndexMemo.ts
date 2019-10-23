import { useRef } from 'react';
import shallowEqual from 'shallowequal';

interface Cache<MemoType> {
  cacheResult: MemoType;
  conditions: any[];
}

function useIndexMemo<MemoType>(cacheLength: number) {
  const cacheRef = useRef<Cache<MemoType>[]>([]);

  function memoFunc(index: number, generator: () => MemoType, conditions: any[]): MemoType {
    const cache = cacheRef.current[index];

    if (!cache || !shallowEqual(cache.conditions, conditions)) {
      cacheRef.current[index] = {
        cacheResult: generator(),
        conditions,
      };
    }

    // Remove out of range cache
    if (cacheRef.current.length > cacheLength) {
      cacheRef.current = cacheRef.current.slice(0, cacheLength);
    }

    return cacheRef.current[index].cacheResult;
  }

  return memoFunc;
}

export default useIndexMemo;
