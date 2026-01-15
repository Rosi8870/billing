import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  ChevronDown,
  LogOut,
  User,
  Bell,
} from "lucide-react";

export default function Topbar({ title = "Dashboard", subtitle }) {
  const { logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <div
        className="
          mx-6 mt-6 rounded-2xl
          border border-white/10
          bg-gradient-to-br from-white/8 to-white/2
          backdrop-blur-xl shadow-lg
        "
      >
        <div className="flex items-center justify-between px-6 py-4">

          {/* LEFT — PAGE IDENTITY */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-white leading-tight">
              {title}
            </h2>
            <p className="text-xs text-gray-400">
              {subtitle || "Overview & actions"}
            </p>
          </div>

          {/* RIGHT — ACTIONS */}
          <div className="flex items-center gap-4">

            {/* Notifications (future-ready) */}
            <button
              className="
                relative rounded-xl p-2
                border border-white/10
                bg-white/5 hover:bg-white/10
                transition
              "
              title="Notifications"
            >
              <Bell size={18} className="text-gray-300" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-500" />
            </button>

            {/* USER PROFILE */}
            <div className="relative">
              <button
                onClick={() => setOpen(o => !o)}
                className="
                  flex items-center gap-3
                  rounded-xl px-3 py-2
                  border border-white/10
                  bg-white/5 hover:bg-white/10
                  transition
                "
              >
                {/* Avatar */}
                <div
                  className="
                    h-9 w-9 rounded-full
                    bg-gradient-to-br from-blue-500 to-purple-600
                    flex items-center justify-center
                    text-sm font-bold text-white
                    shadow-md
                  "
                >
                  A
                </div>

                {/* Name */}
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-sm font-medium text-white">
                    Admin
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Administrator
                  </span>
                </div>

                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* DROPDOWN */}
              {open && (
                <div
                  onMouseLeave={() => setOpen(false)}
                  className="
                    absolute right-0 mt-3 w-48
                    rounded-xl overflow-hidden
                    border border-white/10
                    bg-[#0b0f1a]
                    shadow-2xl
                  "
                >
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium text-white">
                      Admin
                    </p>
                    <p className="text-xs text-gray-400">
                      admin@billpro.app
                    </p>
                  </div>

                  <button
                    className="
                      w-full flex items-center gap-2
                      px-4 py-3 text-sm text-gray-300
                      hover:bg-white/5 transition
                    "
                  >
                    <User size={14} /> Profile
                  </button>

                  <button
                    onClick={logout}
                    className="
                      w-full flex items-center gap-2
                      px-4 py-3 text-sm text-red-300
                      hover:bg-red-500/10 transition
                    "
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
