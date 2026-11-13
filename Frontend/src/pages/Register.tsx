import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { register } from "../api/authApi";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (name.trim().length < 3) {
      setError("Nama lengkap harus minimal 3 karakter.");
      return;
    }

    if (password.length < 8) {
      setError("Password harus minimal 8 karakter.");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setSuccess("Registrasi berhasil! Mengalihkan ke halaman login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: unknown) {
      console.error("Gagal registrasi:", err);
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message
        : "Registrasi gagal. Silakan periksa kembali data Anda.";
      setError(
        msg || "Registrasi gagal. Silakan periksa kembali data Anda."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-card-header">
          <h1>Daftar Akun Baru</h1>
          <p>Bergabunglah dengan komunitas kuliner kampus KantinHub</p>
        </header>

        <form className="auth-card-body" onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-group">
            <label htmlFor="name">Nama Lengkap</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              minLength={3}
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              maxLength={150}
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
              placeholder="Minimal 8 karakter"
              minLength={8}
              maxLength={72}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: "8px", width: "100%" }}
            disabled={loading}
          >
            {loading ? "Memproses Pendaftaran..." : "✨ Daftar Sekarang"}
          </button>
        </form>

        <footer className="auth-card-footer">
          <p>
            Sudah memiliki akun?{" "}
            <Link to="/login" style={{ fontWeight: 600 }}>
              Masuk di sini
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
