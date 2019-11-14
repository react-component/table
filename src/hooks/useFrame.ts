import { useRef, useState, useEffect } from 'react';
import raf from 'raf';

export type Updater<State> = (prev: State) => State;

export function useFrameState<State>(
  defaultState: State,
): [State, (updater: Updater<State>) => void] {
  const [state, setState] = useState<State>(defaultState);

  const timeoutRef = useRef<number>(null);
  const tmpStateRef = useRef<State>(null);

  function setFrameState(updater: Updater<State>) {
    if (timeoutRef.current === null) {
      tmpStateRef.current = state;
      timeoutRef.current = raf(() => {
        setState(tmpStateRef.current);
        timeoutRef.current = null;
      });
    }

    tmpStateRef.current = updater(tmpStateRef.current);
  }

  useEffect(() => {
    raf.cancel(timeoutRef.current);
  }, []);

  return [state, setFrameState];
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
