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

  if (loading) {
    return (
      <div className="text-gray-400 text-center py-10">
        Loading invoices...
      </div>
    );
  }

  if (!loading && invoices.length === 0) {
    return (
      <div className="text-gray-400 text-center py-10">
        No invoices found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Invoices</h1>
        <p className="text-gray-400 text-sm">
          View & manage generated invoices
        </p>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="space-y-4 md:hidden">
        {invoices.map((inv) => (
          <div
            key={inv._id}
            className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="font-semibold text-white">
                {inv.invoiceNumber}
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-300">
                Paid
              </span>
            </div>

            <div className="text-sm text-gray-300">
              Customer: {inv.customer?.name || "Walk-in"}
            </div>

            <div className="text-sm text-gray-300">
              Date: {new Date(inv.createdAt).toLocaleDateString()}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="font-bold text-emerald-300">
                ₹{inv.grandTotal}
              </div>

              <button
                onClick={() => downloadPDF(inv._id)}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2
                  bg-white/10 hover:bg-white/15 transition text-white text-sm"
              >
                <FileDown size={14} />
                PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
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
