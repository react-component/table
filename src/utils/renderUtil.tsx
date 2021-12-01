import * as React from 'react';

/**
 * Skip render if parent node is not re-render. Works in concurrent mode.
 *
 * zombieJ: This is common utility for rendering react components.
 * We may move this to `rc-util` if stable.
 */

export type ContextType = React.Context<number>;

export function createContext(): ContextType {
  return React.createContext(0);
}

function mergeProps<Props>(props: Props, ref: any): Props {
  const mergedProps = { ...props };
  if (ref) {
    (mergedProps as any).ref = ref;
  }

  return mergedProps;
}

export function withProvider<Props>(Context: ContextType, Component: React.ComponentType<Props>) {
  return React.forwardRef((props: Props, ref) => {
    const renderTimesRef = React.useRef(0);
    renderTimesRef.current += 1;

    return (
      <Context.Provider value={renderTimesRef.current}>
        <Component {...mergeProps(props, ref)} />
      </Context.Provider>
    );
  });
}

export function withConsumer<Props>(Context: ContextType, Component: React.ComponentType<Props>) {
  return React.forwardRef((props: Props, ref) => {
    const renderTimes = React.useContext(Context);

    return React.useMemo(() => <Component {...mergeProps(props, ref)} />, [renderTimes]);
  });
}
