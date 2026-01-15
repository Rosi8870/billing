import { Link, useLocation } from "react-router-dom";
import { useRef, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Users,
  FilePlus,
  Receipt,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SidebarTooltip from "../components/ui/SidebarTooltip";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Products", path: "/products", icon: Package },
  { name: "Customers", path: "/customers", icon: Users },
  { name: "Create Invoice", path: "/invoice/create", icon: FilePlus },
  { name: "Invoices", path: "/invoices", icon: Receipt },
  { name: "Reports", path: "/reports", icon: BarChart3 },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(null);

  return (
    <aside
      className={`
        h-screen shrink-0 transition-all duration-300 ease-in-out
        ${collapsed ? "w-[76px]" : "w-[260px]"}
        bg-gradient-to-b from-[#0b0f1a]/95 to-[#0b0f1a]/80
        backdrop-blur-xl border-r border-white/10
        text-white flex flex-col
        z-50
      `}
    >
      {/* BRAND */}
      <div className="relative px-4 py-5 border-b border-white/10">
        {!collapsed ? (
          <>
            <h1 className="text-xl font-extrabold tracking-wide">
              BILL<span className="text-blue-400">PRO</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Billing Management
            </p>
          </>
        ) : (
          <div className="flex justify-center text-lg font-extrabold">
            B<span className="text-blue-400">P</span>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 rounded-full bg-[#0b0f1a]
          border border-white/10 p-1.5 hover:bg-white/10 transition"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          const ref = useRef(null);

          return (
            <div key={item.name} className="relative">
              <Link
                ref={ref}
                to={item.path}
                onMouseEnter={() => collapsed && setHovered(item.name)}
                onMouseLeave={() => setHovered(null)}
                className={`relative group flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                  ${
                    active
                      ? "bg-white/10"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2
                  h-6 w-1 rounded-full bg-gradient-to-b from-blue-400 to-purple-500" />
                )}

                <div
                  className={`flex items-center justify-center rounded-lg p-2
                    ${
                      active
                        ? "bg-gradient-to-br from-blue-500/30 to-purple-600/30"
                        : "bg-white/5 group-hover:bg-white/10"
                    }`}
                >
                  <Icon size={18} />
                </div>

                {!collapsed && (
                  <span className="font-medium whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>

              {/* PORTAL TOOLTIP */}
              {collapsed && (
                <SidebarTooltip
                  targetRef={ref}
                  text={item.name}
                  show={hovered === item.name}
                />
              )}
            </div>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="px-4 py-4 border-t border-white/10 text-xs text-gray-500">
        {!collapsed ? "© 2026 BillPro" : "©"}
      </div>
    </aside>
  );
}
