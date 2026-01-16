import { useEffect, useState } from "react";
import api from "../api/axios";
import { FileDown } from "lucide-react";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/invoices").then((res) => {
      setInvoices(res.data);
      setLoading(false);
    });
  }, []);

  const downloadPDF = (id) => {
  const pdfUrl = `${import.meta.env.VITE_API_URL}/invoices/${id}/pdf`;
  window.open(pdfUrl, "_blank");
};


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Invoices</h1>
        <p className="text-gray-400 text-sm">View & manage generated invoices</p>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-300 text-sm">
            <tr>
              <th className="px-5 py-4">Invoice No</th>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Amount</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                  Loading invoices...
                </td>
              </tr>
            )}

            {!loading && invoices.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                  No invoices found
                </td>
              </tr>
            )}

            {invoices.map((inv) => (
              <tr
                key={inv._id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="px-5 py-4 font-medium text-white">
                  {inv.invoiceNumber}
                </td>
                <td className="px-5 py-4 text-gray-300">
                  {inv.customer?.name || "Walk-in"}
                </td>
                <td className="px-5 py-4 text-gray-300">
                  {new Date(inv.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 font-semibold text-emerald-300">
                  ₹{inv.grandTotal}
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-blue-500/20 text-blue-300">
                    Paid
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => downloadPDF(inv._id)}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2
                      bg-white/10 hover:bg-white/15 transition text-white"
                  >
                    <FileDown size={16} />
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
