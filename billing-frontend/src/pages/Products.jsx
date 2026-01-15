import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    gstPercent: "",
    stock: ""
  });
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async () => {
    if (!form.name || !form.price) return;
    setLoading(true);
    await api.post("/products", {
      name: form.name,
      price: Number(form.price),
      gstPercent: Number(form.gstPercent || 0),
      stock: Number(form.stock || 0),
    });
    setForm({ name: "", price: "", gstPercent: "", stock: "" });
    setLoading(false);
    loadProducts();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <p className="text-gray-400 text-sm">Manage inventory & pricing</p>
      </div>

      {/* Add Product Card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
        <h3 className="text-white font-semibold mb-4">Add Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-transparent border border-white/20 rounded-lg px-4 py-2
              text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="bg-transparent border border-white/20 rounded-lg px-4 py-2
              text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="GST %"
            type="number"
            value={form.gstPercent}
            onChange={(e) => setForm({ ...form, gstPercent: e.target.value })}
            className="bg-transparent border border-white/20 rounded-lg px-4 py-2
              text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="bg-transparent border border-white/20 rounded-lg px-4 py-2
              text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={addProduct}
          disabled={loading}
          className={`mt-4 inline-flex items-center rounded-lg px-5 py-2 font-semibold
            ${loading ? "bg-gray-500" : "bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"}`}
        >
          {loading ? "Saving..." : "Add Product"}
        </button>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-300 text-sm">
            <tr>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">GST</th>
              <th className="px-5 py-4">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p._id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="px-5 py-4 font-medium text-white">
                  {p.name}
                </td>
                <td className="px-5 py-4 text-gray-300">
                  ₹{p.price}
                </td>
                <td className="px-5 py-4 text-gray-300">
                  {p.gstPercent}%
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold
                      ${p.stock > 10
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-red-500/20 text-red-300"}`}
                  >
                    {p.stock}
                  </span>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
