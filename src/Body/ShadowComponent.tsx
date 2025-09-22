import * as React from 'react';
import { createPortal } from 'react-dom';

export default function ShadowComponent({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [shadowRoot, setShadowRoot] = React.useState<ShadowRoot | null>(null);

  React.useEffect(() => {
    if (hostRef.current && !shadowRoot) {
      const shadow = hostRef.current.attachShadow({ mode: 'open' });
      setShadowRoot(shadow);
    }
  }, [shadowRoot]);

  return (
    <div ref={hostRef} className={className}>
      {shadowRoot && createPortal(children, shadowRoot)}
    </div>
  );
}
