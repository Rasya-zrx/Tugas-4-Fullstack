import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { createStall } from "../api/stallApi";
import { useAuth } from "../context/AuthContext";

export default function CreateStall() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return (
      <div className="container">
        <div className="state-container">
          <div className="spinner"></div>
          <p className="state-title">Memeriksa status login...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container form-page">
        <div className="state-container">
          <div className="state-icon">🔒</div>
          <h2 className="state-title">Akses Dibatasi</h2>
          <p className="state-message">
            Silakan login terlebih dahulu untuk menambahkan kantin baru.
          </p>
          <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
            <Link to="/login" className="btn btn-primary">
              Login Sekarang
            </Link>
            <Link to="/" className="btn btn-secondary">
              Kembali
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== "admin" && user.role !== "owner") {
    return (
      <div className="container form-page">
        <div className="state-container">
          <div className="state-icon">🚫</div>
          <h2 className="state-title">Akses Ditolak (403 Forbidden)</h2>
          <p className="state-message">
            Akun Anda ({user.role}) tidak memiliki izin untuk menambahkan kantin.
            Fitur ini hanya dapat diakses oleh peran <strong>Owner</strong> atau <strong>Admin</strong>.
          </p>
          <Link to="/" className="btn btn-secondary" style={{ marginTop: "16px" }}>
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 3) {
      setError("Nama kantin harus minimal 3 karakter.");
      return;
    }

    try {
      setLoading(true);

      await createStall({
        name: name.trim(),
        category: category.trim() ? category.trim() : undefined,
        location: location.trim() ? location.trim() : undefined,
        description: description.trim() ? description.trim() : undefined,
      });

      alert("Kantin baru berhasil ditambahkan!");
      navigate("/");
    } catch (err: unknown) {
      console.error("Gagal menambahkan kantin:", err);
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message
        : "Gagal menambahkan kantin. Silakan periksa kelengkapan form.";
      setError(
        msg || "Gagal menambahkan kantin. Silakan periksa kelengkapan form."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container form-page">
      <Link to="/" className="detail-back">
        ← Batal dan Kembali
      </Link>

      <div className="form-card">
        <header className="form-card-header">
          <h1>Tambah Kantin Baru</h1>
        </header>

        <form className="form-card-body" onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">
              Nama Kantin <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="Contoh: Warung Nasi Bu Siti"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={3}
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Kategori Makanan / Minuman</label>
            <input
              id="category"
              type="text"
              placeholder="Contoh: Nasi, Ayam, Minuman, Snack"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Lokasi Kantin</label>
            <input
              id="location"
              type="text"
              placeholder="Contoh: Kantin FMIPA Lantai 1"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Deskripsi Singkat</label>
            <textarea
              id="description"
              placeholder="Jelaskan menu andalan, jam buka, atau keunikan kantin ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Menyimpan Data..." : "💾 Simpan Kantin"}
            </button>
            <Link to="/" className="btn btn-secondary">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
