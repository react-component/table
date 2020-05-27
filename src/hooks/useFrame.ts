import { useRef, useState, useEffect } from 'react';

export type Updater<State> = (prev: State) => State;

export function useFrameState<State>(
  defaultState: State,
): [State, (updater: Updater<State>) => void] {
  const stateRef = useRef(defaultState);
  const [, forceUpdate] = useState({});

  const timeoutRef = useRef<number>(null);
  const updateBatchRef = useRef<Updater<State>[]>([]);

  function setFrameState(updater: Updater<State>) {
    if (timeoutRef.current === null) {
      updateBatchRef.current = [];
      timeoutRef.current = requestAnimationFrame(() => {
        updateBatchRef.current.forEach(batchUpdater => {
          stateRef.current = batchUpdater(stateRef.current);
        });
        timeoutRef.current = null;
        forceUpdate({});
      });
    }

    updateBatchRef.current.push(updater);
  }

  useEffect(
    () => () => {
      cancelAnimationFrame(timeoutRef.current);
    },

    [],
  );

  return [stateRef.current, setFrameState];
}

/** Lock frame, when frame pass reset the lock. */
export function useTimeoutLock<State>(defaultState?: State): [(state: State) => void, () => State] {
  const frameRef = useRef<State | null>(defaultState);
  const timeoutRef = useRef<number>(null);

  function cleanUp() {
    window.clearTimeout(timeoutRef.current);
  }

  function setState(newState: State) {
    frameRef.current = newState;
    cleanUp();

    timeoutRef.current = window.setTimeout(() => {
      frameRef.current = null;
      timeoutRef.current = null;
    }, 100);
  }

  function getState() {
    return frameRef.current;
  }

  useEffect(() => cleanUp, []);

  return [setState, getState];
}
