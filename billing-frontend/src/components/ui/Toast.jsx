import { createContext, useContext, useState } from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = (type, message) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, type, message }]);

    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-50 space-y-3">
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

function ToastItem({ type, message }) {
  const styles = {
    success: {
      icon: <CheckCircle size={18} />,
      bg: "bg-emerald-500/15 border-emerald-400/30 text-emerald-300",
    },
    error: {
      icon: <XCircle size={18} />,
      bg: "bg-red-500/15 border-red-400/30 text-red-300",
    },
    info: {
      icon: <Info size={18} />,
      bg: "bg-blue-500/15 border-blue-400/30 text-blue-300",
    },
  };

  return (
    <div
      className={`
        flex items-center gap-3 rounded-xl border backdrop-blur-xl px-4 py-3
        shadow-2xl animate-slide-in
        ${styles[type].bg}
      `}
    >
      {styles[type].icon}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
