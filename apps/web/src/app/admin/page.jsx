import { useState, useEffect, useCallback } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import Logo from "../../components/Logo";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("ecl-admin-token");
    if (token) {
      window.location.href = "/admin/dashboard";
    }
  }, []);

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Login failed");
          return;
        }
        localStorage.setItem("ecl-admin-token", data.token);
        localStorage.setItem("ecl-admin-user", JSON.stringify(data.admin));
        window.location.href = "/admin/dashboard";
      } catch (err) {
        console.error(err);
        setError("Connection error. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [username, password],
  );

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-[#0A0A0A] bg-[#F9FAFB] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-4" />
          <p className="text-sm dark:text-white/40 text-gray-500 font-inter">
            Admin Dashboard
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-xl border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A] bg-white p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-[#F9FAFB] dark:text-white text-gray-900 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#C8A96E]"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-[#F9FAFB] dark:text-white text-gray-900 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#C8A96E]"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-white/40 text-gray-400"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 font-inter">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#C8A96E] text-white font-semibold rounded-lg hover:bg-[#B8955E] transition-colors text-sm font-inter disabled:opacity-50"
          >
            <Lock size={14} />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs dark:text-white/20 text-gray-400 mt-4 font-inter">
          First login: use username "admin" and any password to set up.
        </p>
      </div>
    </div>
  );
}
