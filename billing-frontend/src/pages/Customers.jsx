import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    gstNumber: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);

  const loadCustomers = async () => {
    const res = await api.get("/customers");
    setCustomers(res.data);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const addCustomer = async () => {
    if (!form.name || !form.phone) return;
    setLoading(true);
    await api.post("/customers", form);
    setForm({ name: "", phone: "", gstNumber: "", address: "" });
    setLoading(false);
    loadCustomers();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="text-gray-400 text-sm">Manage your customer base</p>
      </div>

      {/* Add Customer */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
        <h3 className="text-white font-semibold mb-4">Add Customer</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            placeholder="Customer name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-transparent border border-white/20 rounded-lg px-4 py-2
              text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="bg-transparent border border-white/20 rounded-lg px-4 py-2
              text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="GST Number (optional)"
            value={form.gstNumber}
            onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
            className="bg-transparent border border-white/20 rounded-lg px-4 py-2
              text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="bg-transparent border border-white/20 rounded-lg px-4 py-2
              text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={addCustomer}
          disabled={loading}
          className={`mt-4 inline-flex items-center rounded-lg px-5 py-2 font-semibold
            ${loading
              ? "bg-gray-500"
              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"}`}
        >
          {loading ? "Saving..." : "Add Customer"}
        </button>
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-300 text-sm">
            <tr>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Phone</th>
              <th className="px-5 py-4">GST</th>
              <th className="px-5 py-4">Address</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr
                key={c._id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="px-5 py-4 font-medium text-white">
                  {c.name}
                </td>
                <td className="px-5 py-4 text-gray-300">
                  {c.phone}
                </td>
                <td className="px-5 py-4">
                  {c.gstNumber ? (
                    <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold
                      bg-emerald-500/20 text-emerald-300">
                      {c.gstNumber}
                    </span>
                  ) : (
                    <span className="text-gray-500 text-xs">N/A</span>
                  )}
                </td>
                <td className="px-5 py-4 text-gray-300">
                  {c.address || "-"}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
