import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

export default function Dropdown({
  value,
  onChange,
  options = [],
  placeholder = "Select",
  variant = "form", // "form" | "table"
}) {
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const selected = options.find(o => o.value === value);

  /* position menu */
  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setPos({
      top: r.bottom + window.scrollY + 4,
      left: r.left + window.scrollX,
      width: r.width,
    });
  }, [open]);

  /* outside click */
  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (
        !triggerRef.current?.contains(e.target) &&
        !menuRef.current?.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  /* ================= STYLES ================= */

  const triggerStyle =
    variant === "table"
      ? `
        h-8 px-2 text-sm rounded-md
        bg-[#1e232d]
        border border-white/10
        hover:border-white/30
      `
      : `
        h-10 px-3 text-base rounded-lg
        bg-[#1f2430]
        border border-white/10
        hover:border-white/25
      `;

  const menuStyle =
    variant === "table"
      ? "text-sm"
      : "text-base";

  return (
    <>
      {/* TRIGGER */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`
          w-full flex items-center justify-between text-left
          text-white transition
          ${triggerStyle}
          ${open ? "border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.6)]" : ""}
        `}
      >
        <span className={`truncate ${selected ? "" : "text-gray-400"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* MENU (PORTAL) */}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
            }}
            className={`
              fixed z-[10000]
              rounded-md border border-white/10
              bg-[#151922] shadow-2xl
              max-h-60 overflow-y-auto
              ${menuStyle}
            `}
          >
            {options.map(opt => {
              const active = opt.value === value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`
                    w-full px-3 py-2 text-left transition
                    ${active
                      ? "bg-blue-600/20 text-blue-300"
                      : "text-gray-300 hover:bg-white/5"
                    }
                  `}
                >
                  {opt.label}
                </button>
              );
            })}

            {options.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">
                No options
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
