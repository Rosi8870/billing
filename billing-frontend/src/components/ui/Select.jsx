import { ChevronDown } from "lucide-react";

export default function Select({ value, onChange, children, className = "" }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`appearance-none w-full bg-[#0b0f1a]/80 backdrop-blur-xl
        border border-white/20 rounded-xl px-4 py-2 pr-10 text-white
        focus:outline-none focus:ring-2 focus:ring-blue-500
        hover:bg-white/5 transition ${className}`}
      >
        {children}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}
