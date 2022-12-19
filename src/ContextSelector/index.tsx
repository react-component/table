import useEvent from 'rc-util/lib/hooks/useEvent';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import * as React from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import isEqual from 'rc-util/lib/isEqual';

export type Selector<T, O = T> = (value: T) => O;

export type Trigger<T> = (value: T) => void;

export type Listeners<T> = Set<Trigger<T>>;

export interface Context<T> {
  getValue: () => T;
  listeners: Listeners<T>;
}

export interface ContextSelectorProviderProps<T> {
  value: T;
  children?: React.ReactNode;
}

export interface ReturnCreateContext<T> {
  Context: React.Context<Context<T>>;
  Provider: React.ComponentType<ContextSelectorProviderProps<T>>;
}

export function createContext<T>(defaultContext?: T): ReturnCreateContext<T> {
  const Context = React.createContext<Context<T>>(defaultContext as any);

  const Provider = ({ value, children }: ContextSelectorProviderProps<T>) => {
    const valueRef = React.useRef(value);
    valueRef.current = value;

    const [context] = React.useState<Context<T>>(() => ({
      getValue: () => valueRef.current,
      listeners: new Set(),
    }));

    useLayoutEffect(() => {
      unstable_batchedUpdates(() => {
        context.listeners.forEach(listener => {
          listener(value);
        });
      });
    }, [value]);

    return <Context.Provider value={context}>{children}</Context.Provider>;
  };

  return { Context, Provider };
}

export function useContextSelector<T, O>(
  holder: ReturnCreateContext<T>,
  selector: Selector<T, O>,
): O;
export function useContextSelector<T, O extends Partial<T>>(
  holder: ReturnCreateContext<T>,
  selector: (keyof T)[],
): O;
export function useContextSelector<T, S extends keyof T>(
  holder: ReturnCreateContext<T>,
  selector: S,
): T[S];

export function useContextSelector<T, O>(
  holder: ReturnCreateContext<T>,
  selector: Selector<T, any> | (keyof T)[] | keyof T,
) {
  const eventSelector = useEvent<Selector<T, O>>(
    typeof selector === 'function'
      ? selector
      : ctx => {
          if (!Array.isArray(selector)) {
            return ctx[selector];
          }

          const obj = {} as O;
          selector.forEach(key => {
            (obj as any)[key] = ctx[key];
          });
          return obj;
        },
  );
  const context = React.useContext(holder?.Context);
  const { listeners, getValue } = context || {};

  const valueRef = React.useRef<O>();
  valueRef.current = eventSelector(context ? getValue() : null);
  const [, forceUpdate] = React.useState({});

  useLayoutEffect(() => {
    if (!context) {
      return;
    }

    function trigger(nextValue: T) {
      const nextSelectorValue = eventSelector(nextValue);
      if (!isEqual(valueRef.current, nextSelectorValue, true)) {
        forceUpdate({});
      }
    }

    listeners.add(trigger);

    return () => {
      listeners.delete(trigger);
    };
  }, [context]);

  return valueRef.current;
}
