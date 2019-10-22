import { useRef, useState, useEffect } from 'react';
import raf from 'raf';

export type Updater<State> = (prev: State) => State;

export default function useFrameState<State>(
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
