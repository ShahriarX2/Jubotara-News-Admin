"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await api("/auth/login", "POST", { email, password });

      if (data.token) {
        localStorage.setItem("token", data.token);
        // Set cookie for proxy auth (expires in 7 days)
        document.cookie = `token=${data.token}; path=/; max-age=604800; samesite=lax`;
        router.push("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-xl rounded-2xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>

        {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            className="border w-full p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            required
            className="border w-full p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 transition text-white w-full py-2.5 rounded-lg font-semibold disabled:bg-blue-300"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
