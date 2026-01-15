import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

const KpiCard = ({ title, value, accent }) => (
  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
    <div className={`absolute -top-10 -right-10 h-24 w-24 rounded-full blur-2xl ${accent}`} />
    <p className="text-sm text-gray-400">{title}</p>
    <h3 className="mt-2 text-3xl font-bold text-white">{value}</h3>
  </div>
);

export default function Reports() {
  const [daily, setDaily] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // UI-only date filter (ready for backend params later)
  const [range, setRange] = useState("30d"); // 7d | 30d | 90d

  useEffect(() => {
    Promise.all([
      api.get("/reports/daily"),
      api.get("/reports/monthly"),
      api.get("/reports/top-products"),
      api.get("/invoices"),
    ]).then(([d, m, t, inv]) => {
      setDaily(d.data);
      setMonthly(m.data);
      setTopProducts(t.data);
      setInvoices(inv.data);
    });
  }, []);

  const kpis = useMemo(() => {
    const revenue = invoices.reduce((s, i) => s + (i.grandTotal || 0), 0);
    const count = invoices.length;
    const avg = count ? Math.round(revenue / count) : 0;
    return {
      revenue: `₹${revenue.toLocaleString()}`,
      invoices: count,
      avg: `₹${avg.toLocaleString()}`,
    };
  }, [invoices]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-gray-400 text-sm">Sales & performance analytics</p>
        </div>

        {/* Range Filter (UI-ready) */}
        <div className="flex gap-2">
          {["7d", "30d", "90d"].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-lg px-4 py-2 text-sm transition
                ${range === r
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/15"}`}
            >
              Last {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Total Revenue" value={kpis.revenue} accent="bg-blue-500/30" />
        <KpiCard title="Invoices" value={kpis.invoices} accent="bg-purple-500/30" />
        <KpiCard title="Avg. Invoice" value={kpis.avg} accent="bg-emerald-500/30" />
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
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={false}
                />
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

      {/* Top Products */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
        <h3 className="text-white font-semibold mb-4">Top Products</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="_id" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#34d399" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
