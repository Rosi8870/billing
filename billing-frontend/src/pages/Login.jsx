import { useState, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Enter email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axios.post("/auth/login", { email, password });
      login(res.data.token);
      window.location.href = "/dashboard";
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-3xl" />

      {/* Glass Card */}
      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-white">

        {/* Logo / Title */}
        <h1 className="text-3xl font-bold tracking-wide text-center">
          BILL<span className="text-blue-400">PRO</span>
        </h1>
        <p className="text-center text-gray-300 text-sm mt-1">
          Smart Billing Management
        </p>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-500/20 border border-red-500/30 text-red-300 text-sm p-2 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-transparent border border-white/30 rounded-lg px-4 py-2
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-transparent border border-white/30 rounded-lg px-4 py-2
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold transition-all
              ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.02]"
              }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          © 2026 BillPro Inc.
        </p>
      </div>
    </div>
  );
}
