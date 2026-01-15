import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function SidebarTooltip({ targetRef, text, show }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!show || !targetRef.current) return;

    const r = targetRef.current.getBoundingClientRect();
    setPos({
      top: r.top + r.height / 2,
      left: r.right + 12,
    });
  }, [show, targetRef]);

  if (!show) return null;

  return createPortal(
    <div
      style={{
        top: pos.top,
        left: pos.left,
        transform: "translateY(-50%)",
      }}
      className="
        fixed z-[100000]
        rounded-lg bg-[#0b0f1a]
        border border-white/10
        px-3 py-1.5
        text-xs text-white
        shadow-2xl
        pointer-events-none
        animate-fade-in
      "
    >
      {text}
    </div>,
    document.body
  );
}
