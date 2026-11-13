import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Apakah kamu yakin ingin logout?")) {
      logout();
      navigate("/");
    }
  };

  const getRoleBadgeClass = (role?: string) => {
    switch (role) {
      case "admin":
        return "badge-admin";
      case "owner":
        return "badge-owner";
      case "customer":
      default:
        return "badge-customer";
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="emoji">🍽️</span>
          <span>KantinHub</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="btn btn-link">
            Daftar Kantin
          </Link>

          {user && (user.role === "admin" || user.role === "owner") && (
            <Link to="/stalls/create" className="btn btn-sm btn-primary">
              + Tambah Kantin
            </Link>
          )}

          {user ? (
            <div className="navbar-user">
              <div className="navbar-user-info">
                <div className="navbar-user-name">{user.name}</div>
                <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-sm btn-secondary"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="navbar-links">
              <Link to="/login" className="btn btn-sm btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

