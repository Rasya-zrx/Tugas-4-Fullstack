import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getStallById, updateStall } from "../api/stallApi";
import { useAuth } from "../context/AuthContext";
import type { Stall } from "../types/stall";

export default function EditStall() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [stall, setStall] = useState<Stall | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const fetchStall = async () => {
      try {
        if (!id || isNaN(Number(id))) {
          throw new Error("ID kantin tidak valid.");
        }

        const response = await getStallById(Number(id));
        const data: Stall = response.data;

        if (!isCancelled) {
          setStall(data);
          setName(data.name || "");
          setCategory(data.category || "");
          setLocation(data.location || "");
          setDescription(data.description || "");
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          console.error("Gagal memuat data kantin:", err);
          let msg = "Gagal mengambil data kantin dari server.";
          if (axios.isAxiosError(err)) {
            msg =
              err.response?.status === 404
                ? "Kantin tidak ditemukan."
                : err.response?.data?.message || msg;
          }
          setError(msg);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchStall();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (authLoading || loading) {
    return (
      <div className="container">
        <div className="state-container">
          <div className="spinner"></div>
          <p className="state-title">Memuat data kantin...</p>
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
            Silakan login terlebih dahulu untuk mengedit data kantin.
          </p>
          <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
            <Link to="/login" className="btn btn-primary">
              Login
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
            Anda tidak memiliki izin untuk mengedit kantin.
          </p>
          <Link to="/" className="btn btn-secondary" style={{ marginTop: "16px" }}>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  if (error || !stall) {
    return (
      <div className="container form-page">
        <div className="state-container">
          <div className="state-icon">⚠️</div>
          <h2 className="state-title">Kantin Tidak Ditemukan</h2>
          <p className="state-message">{error || "Data kantin tidak tersedia."}</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: "16px" }}>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // Owner can only edit their own stall
  if (user.role === "owner" && stall.ownerId !== user.id) {
    return (
      <div className="container form-page">
        <div className="state-container">
          <div className="state-icon">🚫</div>
          <h2 className="state-title">Bukan Kantin Milik Anda (403 Forbidden)</h2>
          <p className="state-message">
            Sebagai <strong>Owner</strong>, Anda hanya diperbolehkan mengedit kantin milik Anda sendiri.
            Kantin ini dimiliki oleh pengguna #{stall.ownerId}.
          </p>
          <Link to="/" className="btn btn-secondary" style={{ marginTop: "16px" }}>
            Kembali ke Beranda
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
      setSubmitting(true);

      await updateStall(Number(id), {
        name: name.trim(),
        category: category.trim() ? category.trim() : undefined,
        location: location.trim() ? location.trim() : undefined,
        description: description.trim() ? description.trim() : undefined,
      });

      alert("Data kantin berhasil diperbarui!");
      navigate(`/stalls/${id}`);
    } catch (err: unknown) {
      console.error("Gagal memperbarui kantin:", err);
      let msg = "Gagal memperbarui kantin.";
      if (axios.isAxiosError(err)) {
        msg =
          err.response?.status === 403
            ? "Akses ditolak: Anda tidak memiliki wewenang untuk mengubah data kantin ini."
            : err.response?.data?.message || msg;
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container form-page">
      <Link to={`/stalls/${id}`} className="detail-back">
        ← Batal dan Kembali
      </Link>

      <div className="form-card">
        <header className="form-card-header">
          <h1>Edit Data Kantin</h1>
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={3}
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Kategori</label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Lokasi</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Deskripsi</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Menyimpan Perubahan..." : "💾 Simpan Perubahan"}
            </button>
            <Link to={`/stalls/${id}`} className="btn btn-secondary">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
