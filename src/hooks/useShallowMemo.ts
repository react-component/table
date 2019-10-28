import { useRef } from 'react';
import shallowEqual from 'shallowequal';

const INIT_CONDITION = {
  [Math.random()]: Math.random(),
};

export default function useShallowMemo<T, C>(callback: () => T, condition: C) {
  const conditionCacheRef = useRef<C | typeof INIT_CONDITION>(INIT_CONDITION);
  const memoRef = useRef<T>(null);

  if (!shallowEqual(condition, conditionCacheRef.current)) {
    conditionCacheRef.current = condition;
    memoRef.current = callback();
  }
  return memoRef.current;
}
