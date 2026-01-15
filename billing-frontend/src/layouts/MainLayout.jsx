import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const titles = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/customers": "Customers",
  "/invoice/create": "Create Invoice",
  "/invoices": "Invoices",
  "/reports": "Reports",
};

export default function MainLayout() {
  const location = useLocation();
  const title = titles[location.pathname] || "Billing";

  return (
    <div className="flex min-h-screen bg-[#0b0f1a]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Topbar title={title} />
        <div className="p-6 text-white">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
