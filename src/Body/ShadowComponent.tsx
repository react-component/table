import * as React from 'react';
import { createPortal } from 'react-dom';

function isShadowDomSupported() {
  return typeof window !== 'undefined' && !!HTMLElement.prototype.attachShadow;
}

export default function ShadowComponent({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [shadowRoot, setShadowRoot] = React.useState<ShadowRoot | null>(null);
  const [shadowSupported, setShadowSupported] = React.useState<boolean>(true);

  React.useEffect(() => {
    // 检查是否支持 Shadow DOM
    if (!isShadowDomSupported()) {
      setShadowSupported(false);
      return;
    }
    if (hostRef.current && !shadowRoot) {
      const shadow = hostRef.current.attachShadow({ mode: 'open' });
      setShadowRoot(shadow);
    }
  }, [shadowRoot]);

  // 如果不支持 Shadow DOM，直接渲染 children
  if (!shadowSupported) {
    return (
      <div ref={hostRef} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={hostRef} className={className}>
      {shadowRoot && createPortal(children, shadowRoot)}
    </div>
  );
}
