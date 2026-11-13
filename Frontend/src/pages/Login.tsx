import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email: email.trim(), password });
      navigate("/");
    } catch (err: unknown) {
      console.error("Gagal login:", err);
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message
        : "Email atau password salah. Silakan coba kembali.";
      setError(
        msg || "Email atau password salah. Silakan coba kembali."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-card-header">
          <h1>Masuk ke KantinHub</h1>
          <p>Kelola dan beri ulasan pada kantin kampus favoritmu</p>
        </header>

        <form className="auth-card-body" onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password Anda"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: "8px", width: "100%" }}
            disabled={loading}
          >
            {loading ? "Memverifikasi..." : "🔑 Masuk"}
          </button>
        </form>

        <footer className="auth-card-footer">
          <p>
            Belum memiliki akun?{" "}
            <Link to="/register" style={{ fontWeight: 600 }}>
              Daftar Sekarang
            </Link>
          </p>
          <div style={{ marginTop: "12px" }}>
            <Link to="/" className="btn-link" style={{ fontSize: "0.85rem" }}>
              ← Kembali ke Beranda
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
