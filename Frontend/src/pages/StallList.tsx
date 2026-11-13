import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getStalls, deleteStall } from "../api/stallApi";
import type { Stall, StallMeta } from "../types/stall";
import { useAuth } from "../context/AuthContext";

export default function StallList() {
  const { user } = useAuth();

  const [stalls, setStalls] = useState<Stall[]>([]);
  const [meta, setMeta] = useState<StallMeta>({ page: 1, limit: 9, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter state
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;

  useEffect(() => {
    let isCancelled = false;

    const loadData = async () => {
      try {
        setError("");
        const response = await getStalls({
          page: currentPage,
          limit,
          search: activeSearch.trim() ? activeSearch.trim() : undefined,
          category: selectedCategory ? selectedCategory : undefined,
        });

        if (!isCancelled) {
          setStalls(response.data || []);
          setMeta(
            response.meta || {
              page: currentPage,
              limit,
              total: response.data ? response.data.length : 0,
            }
          );
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          console.error("Gagal mengambil data kantin:", err);
          const msg = axios.isAxiosError(err)
            ? err.response?.data?.message
            : undefined;
          setError(
            msg ||
              "Gagal memuat daftar kantin. Pastikan server backend dan database aktif."
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [currentPage, activeSearch, selectedCategory]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCurrentPage(1);
    setActiveSearch(searchInput);
  };

  const handleCategoryChange = (cat: string) => {
    setLoading(true);
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setLoading(true);
    setSearchInput("");
    setActiveSearch("");
    setSelectedCategory("");
    setCurrentPage(1);
  };

  const handleDelete = async (id: number, stallName: string) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus kantin "${stallName}"? Tindakan ini tidak dapat dibatalkan.`
    );

    if (!confirmed) return;

    try {
      await deleteStall(id);
      alert(`Kantin "${stallName}" berhasil dihapus.`);
      // Refresh list
      setLoading(true);
      const res = await getStalls({
        page: currentPage,
        limit,
        search: activeSearch.trim() ? activeSearch.trim() : undefined,
        category: selectedCategory ? selectedCategory : undefined,
      });
      setStalls(res.data || []);
      setMeta(
        res.meta || {
          page: currentPage,
          limit,
          total: res.data ? res.data.length : 0,
        }
      );
    } catch (err: unknown) {
      console.error("Gagal menghapus kantin:", err);
      let msg = "Gagal menghapus kantin.";
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          msg = "Akses ditolak: Hanya Admin yang memiliki izin menghapus kantin.";
        } else {
          msg = err.response?.data?.message || msg;
        }
      }
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(meta.total / limit));

  const categoryOptions = [
    "Makanan Berat",
    "Minuman",
    "Snack",
    "Nasi",
    "Mie",
    "Ayam",
    "Kopi",
    "Jus",
  ];

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Kantin & Kuliner Kampus</h1>
          <p>
            Temukan informasi warung kantin, rekomendasi makanan terbaik, dan
            ulasan terpercaya dari sesama mahasiswa.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="filter-bar">
        <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Cari nama kantin atau warung..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        <select
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">Semua Kategori</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {(activeSearch || selectedCategory) && (
          <button
            type="button"
            onClick={handleResetFilter}
            className="btn btn-secondary"
          >
            Reset Filter
          </button>
        )}

        {user && (user.role === "admin" || user.role === "owner") && (
          <Link to="/stalls/create" className="btn btn-primary">
            + Tambah Kantin Baru
          </Link>
        )}
      </section>

      {/* Active Filter Info */}
      {(activeSearch || selectedCategory) && (
        <p className="filter-active-info">
          Menampilkan hasil untuk:{" "}
          {activeSearch && <strong>Pencarian "{activeSearch}" </strong>}
          {selectedCategory && (
            <span>
              Kategori <strong>{selectedCategory}</strong>
            </span>
          )}
        </p>
      )}

      {/* Loading State */}
      {loading && (
        <div className="state-container">
          <div className="spinner"></div>
          <p className="state-title">Memuat daftar kantin...</p>
          <p className="state-message">Mohon tunggu beberapa saat.</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="state-container">
          <div className="state-icon">⚠️</div>
          <h2 className="state-title">Terjadi Kesalahan</h2>
          <p className="state-message">{error}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setCurrentPage(1);
            }}
            className="btn btn-primary"
            style={{ marginTop: "16px" }}
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && stalls.length === 0 && (
        <div className="state-container">
          <div className="state-icon">🍽️</div>
          <h2 className="state-title">Tidak Ada Kantin Ditemukan</h2>
          <p className="state-message">
            {activeSearch || selectedCategory
              ? "Tidak ada kantin yang cocok dengan kata kunci atau kategori yang Anda pilih."
              : "Belum ada data kantin yang terdaftar di sistem."}
          </p>
          {(activeSearch || selectedCategory) && (
            <button
              type="button"
              onClick={handleResetFilter}
              className="btn btn-secondary"
              style={{ marginTop: "16px" }}
            >
              Tampilkan Semua Kantin
            </button>
          )}
        </div>
      )}

      {/* Stall Grid */}
      {!loading && !error && stalls.length > 0 && (
        <>
          <div className="stall-grid">
            {stalls.map((stall) => {
              const canEdit =
                user &&
                (user.role === "admin" ||
                  (user.role === "owner" && stall.ownerId === user.id));

              const canDelete = user && user.role === "admin";

              return (
                <article className="stall-card" key={stall.id}>
                  <div className="stall-card-header">
                    <h3>{stall.name}</h3>
                    {stall.isPopular && (
                      <span className="stall-card-popular">🔥 Populer</span>
                    )}
                  </div>

                  <div className="stall-card-body">
                    <div className="stall-card-meta">
                      {stall.category && (
                        <span className="stall-card-tag">
                          🏷️ {stall.category}
                        </span>
                      )}
                      {stall.location && (
                        <span className="stall-card-tag">
                          📍 {stall.location}
                        </span>
                      )}
                    </div>

                    <p className="stall-card-desc">
                      {stall.description || "Tidak ada deskripsi khusus untuk kantin ini."}
                    </p>

                    <div className="stall-card-stats">
                      <div className="stall-stat">
                        <span className="stall-stat-value">
                          ⭐ {Number(stall.avgRating).toFixed(1)}
                        </span>
                        <span className="stall-stat-label">Rating</span>
                      </div>
                      <div className="stall-stat">
                        <span className="stall-stat-value">
                          💬 {stall.reviewCount}
                        </span>
                        <span className="stall-stat-label">Ulasan</span>
                      </div>
                    </div>
                  </div>

                  <div className="stall-card-footer">
                    <Link
                      to={`/stalls/${stall.id}`}
                      className="btn btn-sm btn-outline"
                    >
                      Lihat Detail
                    </Link>

                    {canEdit && (
                      <Link
                        to={`/stalls/${stall.id}/edit`}
                        className="btn btn-sm btn-secondary"
                      >
                        ✏️ Edit
                      </Link>
                    )}

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDelete(stall.id, stall.name)}
                        className="btn btn-sm btn-danger"
                      >
                        🗑️ Hapus
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setCurrentPage((p) => Math.max(p - 1, 1));
                }}
                disabled={currentPage === 1}
              >
                ← Sebelumnya
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  type="button"
                  className={pg === currentPage ? "active" : ""}
                  onClick={() => {
                    setLoading(true);
                    setCurrentPage(pg);
                  }}
                >
                  {pg}
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setCurrentPage((p) => Math.min(p + 1, totalPages));
                }}
                disabled={currentPage === totalPages}
              >
                Selanjutnya →
              </button>

              <span className="pagination-info">
                Halaman {currentPage} dari {totalPages} (Total {meta.total} kantin)
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
