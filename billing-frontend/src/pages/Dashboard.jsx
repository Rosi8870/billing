import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, ResponsiveContainer
} from "recharts";

const Card = ({ title, value, accent }) => (
  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
    <div className={`absolute -top-10 -right-10 h-24 w-24 rounded-full blur-2xl ${accent}`} />
    <p className="text-sm text-gray-400">{title}</p>
    <h3 className="mt-2 text-3xl font-bold text-white">{value}</h3>
  </div>
);

export default function Dashboard() {
  const [daily, setDaily] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [kpis, setKpis] = useState({
    revenue: 0,
    invoices: 0,
    products: 0,
    customers: 0,
  });

  useEffect(() => {
    // KPIs (simple aggregation endpoints or compute from existing ones)
    Promise.all([
      api.get("/reports/daily"),
      api.get("/reports/monthly"),
      api.get("/invoices"),
      api.get("/products"),
      api.get("/customers"),
    ]).then(([d, m, inv, prod, cust]) => {
      setDaily(d.data);
      setMonthly(m.data);
      const revenue = inv.data.reduce((s, i) => s + (i.grandTotal || 0), 0);
      setKpis({
        revenue: `₹${revenue.toLocaleString()}`,
        invoices: inv.data.length,
        products: prod.data.length,
        customers: cust.data.length,
      });
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm">Overview & analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card title="Total Revenue" value={kpis.revenue} accent="bg-blue-500/30" />
        <Card title="Invoices" value={kpis.invoices} accent="bg-purple-500/30" />
        <Card title="Products" value={kpis.products} accent="bg-emerald-500/30" />
        <Card title="Customers" value={kpis.customers} accent="bg-pink-500/30" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Daily Sales */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
          <h3 className="text-white font-semibold mb-4">Daily Sales</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="_id" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#60a5fa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Sales */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
          <h3 className="text-white font-semibold mb-4">Monthly Sales</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="_id" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="total" fill="#a78bfa" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
