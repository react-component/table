import * as React from 'react';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import useEvent from 'rc-util/lib/hooks/useEvent';
import shallowEqual from 'shallowequal';

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

export function createContext<T>(): ReturnCreateContext<T> {
  const Context = React.createContext<Context<T>>(null as any);

  const Provider = ({ value, children }: ContextSelectorProviderProps<T>) => {
    const valueRef = React.useRef(value);
    valueRef.current = value;

    const [context] = React.useState<Context<T>>(() => ({
      getValue: () => valueRef.current,
      listeners: new Set(),
    }));

    useLayoutEffect(() => {
      context.listeners.forEach(listener => {
        listener(value);
      });
    }, [value]);

    return <Context.Provider value={context}>{children}</Context.Provider>;
  };

  return { Context, Provider };
}

export function useContextSelector<T, O>(holder: ReturnCreateContext<T>, selector: Selector<T, O>) {
  const eventSelector = useEvent(selector);
  const context = React.useContext(holder?.Context);
  const { listeners, getValue } = context || {};

  const [value, setValue] = React.useState(() => eventSelector(context ? getValue() : null));

  React.useLayoutEffect(() => {
    if (!context) {
      return;
    }

    function trigger(nextValue: T) {
      setValue(prev => {
        const selectedValue = eventSelector(nextValue);
        return shallowEqual(prev, selectedValue) ? prev : selectedValue;
      });
    }

    listeners.add(trigger);

    return () => {
      listeners.delete(trigger);
    };
  }, [context]);

  return value;
}
