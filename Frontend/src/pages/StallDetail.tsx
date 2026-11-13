import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getStallById, getStallMenus, deleteStall } from "../api/stallApi";
import type { Stall, MenuItem } from "../types/stall";
import { useAuth } from "../context/AuthContext";

export default function StallDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stall, setStall] = useState<Stall | null>(null);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    const fetchDetail = async () => {
      try {
        if (!id || isNaN(Number(id))) {
          throw new Error("ID kantin tidak valid.");
        }

        const stallId = Number(id);
        const stallRes = await getStallById(stallId);

        if (!isCancelled) {
          setStall(stallRes.data);
        }

        // Fetch menus for this stall
        try {
          const menuRes = await getStallMenus(stallId);
          if (!isCancelled) {
            setMenus(menuRes.data || []);
          }
        } catch (menuErr) {
          console.warn("Gagal memuat menu kantin:", menuErr);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          console.error("Gagal mengambil detail kantin:", err);
          let msg = "Detail kantin gagal dimuat.";
          if (axios.isAxiosError(err)) {
            msg =
              err.response?.status === 404
                ? "Kantin tidak ditemukan atau telah dihapus."
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

    fetchDetail();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!stall) return;

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus kantin "${stall.name}"?`
    );

    if (!confirmed) return;

    try {
      await deleteStall(stall.id);
      alert("Kantin berhasil dihapus!");
      navigate("/");
    } catch (err: unknown) {
      console.error("Gagal menghapus kantin:", err);
      let msg = "Gagal menghapus kantin.";
      if (axios.isAxiosError(err)) {
        msg =
          err.response?.status === 403
            ? "Akses ditolak: Hanya Admin yang dapat menghapus kantin."
            : err.response?.data?.message || msg;
      }
      alert(msg);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="state-container">
          <div className="spinner"></div>
          <p className="state-title">Memuat detail kantin...</p>
        </div>
      </div>
    );
  }

  if (error || !stall) {
    return (
      <div className="container">
        <div className="state-container">
          <div className="state-icon">⚠️</div>
          <h2 className="state-title">Kantin Tidak Ditemukan</h2>
          <p className="state-message">
            {error || "Data kantin yang Anda cari tidak tersedia."}
          </p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: "16px" }}>
            ← Kembali ke Daftar Kantin
          </Link>
        </div>
      </div>
    );
  }

  const canEdit =
    user &&
    (user.role === "admin" ||
      (user.role === "owner" && stall.ownerId === user.id));

  const canDelete = user && user.role === "admin";

  return (
    <div className="container detail-page">
      <Link to="/" className="detail-back">
        ← Kembali ke Daftar Kantin
      </Link>

      <article className="detail-card">
        <header className="detail-card-header">
          <h1>{stall.name}</h1>
          <div className="detail-badges">
            {stall.isPopular && (
              <span
                className="detail-badge"
                style={{ background: "#ffd600", color: "#333", fontWeight: 700 }}
              >
                🔥 Populer
              </span>
            )}
            {stall.category && (
              <span className="detail-badge">🏷️ {stall.category}</span>
            )}
            {stall.location && (
              <span className="detail-badge">📍 {stall.location}</span>
            )}
          </div>
        </header>

        <div className="detail-card-body">
          <div className="detail-stats-grid">
            <div className="detail-stat-card">
              <div className="stat-value">⭐ {Number(stall.avgRating).toFixed(1)}</div>
              <div className="stat-label">Rating Rata-Rata</div>
            </div>
            <div className="detail-stat-card">
              <div className="stat-value">💬 {stall.reviewCount}</div>
              <div className="stat-label">Total Ulasan</div>
            </div>
            <div className="detail-stat-card">
              <div className="stat-value">👤 #{stall.ownerId}</div>
              <div className="stat-label">ID Pemilik Warung</div>
            </div>
          </div>

          <section className="detail-section">
            <h3 className="detail-section-title">Deskripsi Kantin</h3>
            <p className="detail-section-content">
              {stall.description || "Belum ada deskripsi yang ditambahkan untuk kantin ini."}
            </p>
          </section>

          {/* Menus Section */}
          <section className="detail-section">
            <h3 className="detail-section-title">Daftar Menu Tersedia</h3>
            {menus.length === 0 ? (
              <p className="detail-section-content" style={{ color: "var(--text-light)" }}>
                Belum ada daftar menu yang tercatat untuk kantin ini.
              </p>
            ) : (
              <div className="menu-list-grid">
                {menus.map((item) => (
                  <div className="menu-item-card" key={item.id}>
                    <div className="menu-item-info">
                      <div className="menu-item-name">{item.name}</div>
                      <div className="menu-item-price">
                        Rp {Number(item.price).toLocaleString("id-ID")}
                      </div>
                    </div>
                    <span
                      className={`badge ${
                        item.isAvailable ? "badge-customer" : "badge-admin"
                      }`}
                    >
                      {item.isAvailable ? "Tersedia" : "Habis"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Action Buttons for Authorized Roles */}
          {(canEdit || canDelete) && (
            <div className="detail-actions">
              {canEdit && (
                <Link to={`/stalls/${stall.id}/edit`} className="btn btn-secondary">
                  ✏️ Edit Kantin
                </Link>
              )}

              {canDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-danger"
                >
                  🗑️ Hapus Kantin
                </button>
              )}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
