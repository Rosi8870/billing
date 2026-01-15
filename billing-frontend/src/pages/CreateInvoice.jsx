import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import Input from "../components/ui/Input";
import Dropdown from "../components/ui/Dropdown";
import { Plus, Trash2, Receipt } from "lucide-react";
import { useToast } from "../components/ui/Toast";

export default function CreateInvoice() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([
    { productId: "", qty: 1, price: 0, gst: 0, total: 0 }
  ]);
  const [saving, setSaving] = useState(false);

  const toast = useToast();

  useEffect(() => {
    api.get("/customers").then(r => setCustomers(r.data));
    api.get("/products").then(r => setProducts(r.data));
  }, []);

  const recalcRow = (row) => {
    const p = products.find(x => x._id === row.productId);
    if (!p) return { ...row, price: 0, gst: 0, total: 0 };

    const amount = p.price * row.qty;
    const gstAmt = (amount * (p.gstPercent || 0)) / 100;

    return {
      ...row,
      price: p.price,
      gst: p.gstPercent || 0,
      total: amount + gstAmt
    };
  };

  const updateRow = (i, patch) => {
    setItems(items.map((r, idx) =>
      idx === i ? recalcRow({ ...r, ...patch }) : r
    ));
  };

  const addRow = () => {
    setItems([...items, { productId: "", qty: 1, price: 0, gst: 0, total: 0 }]);
  };

  const removeRow = (i) => {
    setItems(items.filter((_, idx) => idx !== i));
  };

  const totals = useMemo(() => {
    const sub = items.reduce((s, r) => s + r.price * r.qty, 0);
    const gst = items.reduce(
      (s, r) => s + (r.price * r.qty * r.gst) / 100,
      0
    );
    return { sub, gst, grand: sub + gst };
  }, [items]);

  const saveInvoice = async () => {
    if (!customerId || items.length === 0) {
      toast.show("error", "Select customer and items");
      return;
    }

    setSaving(true);
    try {
      await api.post("/invoices", {
        customerId,
        items: items.map(r => ({
          productId: r.productId,
          quantity: r.qty
        }))
      });
      toast.show("success", "Invoice created successfully");
    } catch {
      toast.show("error", "Failed to create invoice");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10">
          <Receipt className="text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Create Invoice</h1>
          <p className="text-gray-400 text-sm">
            Professional billing & tax calculation
          </p>
        </div>
      </div>

      {/* CUSTOMER CARD */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 p-5 shadow-lg">
        <h3 className="text-white font-semibold mb-3">Customer Details</h3>
        <Dropdown
          placeholder="Select customer"
          value={customerId}
          onChange={setCustomerId}
          options={customers.map(c => ({
            value: c._id,
            label: c.name
          }))}
        />
      </div>

      {/* ITEMS CARD */}
      <div className="relative rounded-xl border border-white/10 bg-white/5 overflow-x-auto">

        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="text-white font-semibold">Invoice Items</h3>
          <button
            onClick={addRow}
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg
            bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition"
          >
            <Plus size={14} /> Add Item
          </button>
        </div>

        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 w-20">Qty</th>
              <th className="px-4 py-3 w-20">Price</th>
              <th className="px-4 py-3 w-20">GST</th>
              <th className="px-4 py-3 w-24">Total</th>
              <th className="px-4 py-3 w-12"></th>
            </tr>
          </thead>

          <tbody>
            {items.map((r, i) => (
              <tr
                key={i}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="px-4 py-3 w-64">
                  <Dropdown
                    placeholder="Select product"
                    value={r.productId}
                    onChange={(val) => updateRow(i, { productId: val })}
                    options={products.map(p => ({
                      value: p._id,
                      label: p.name
                    }))}
                  />
                </td>

                <td className="px-4 py-3">
                  <Input
                    className="h-9 text-sm"
                    type="number"
                    min="1"
                    value={r.qty}
                    onChange={e => updateRow(i, { qty: Number(e.target.value) })}
                  />
                </td>

                <td className="px-4 py-3 text-gray-300">₹{r.price}</td>
                <td className="px-4 py-3 text-gray-300">{r.gst}%</td>
                <td className="px-4 py-3 font-semibold text-white">
                  ₹{r.total}
                </td>

                <td className="px-4 py-3">
                  <button
                    onClick={() => removeRow(i)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SUMMARY + ACTION */}
      <div className="max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 p-6 shadow-xl">
        <div className="space-y-2 text-gray-300 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{totals.sub}</span>
          </div>
          <div className="flex justify-between">
            <span>GST</span>
            <span>₹{totals.gst}</span>
          </div>
        </div>

        <div className="my-4 h-px bg-white/10" />

        <div className="flex justify-between text-white text-lg font-bold">
          <span>Total</span>
          <span>₹{totals.grand}</span>
        </div>

        <button
          onClick={saveInvoice}
          disabled={saving}
          className="mt-6 w-full rounded-xl py-3 font-semibold text-white
          bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90
          shadow-lg shadow-blue-500/30"
        >
          {saving ? "Saving..." : "Create Invoice"}
        </button>
      </div>
    </div>
  );
}
