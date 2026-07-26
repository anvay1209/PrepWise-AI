import { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../features/auth/auth.context.jsx";
import { logout as logoutApi } from "../features/auth/services/auth.api.js";
import logoSrc from "../assets/prepwise-logo.png";
import "./layout.scss";

const Layout = () => {
  const { user, loading, setUser, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi();
      setUser(null);
      navigate("/login");
    } catch (err) {
      setError("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="app-layout">
      <header className="site-header">
        <button type="button" className="brand-group brand-link" onClick={() => navigate("/dashboard")}
          aria-label="Go to home page"
        >
          <div className="brand-mark">
            <img src={logoSrc} alt="PrepWise AI logo" className="brand-logo" />
          </div>
          <div className="brand-copy">
            <span className="brand-name">PrepWise AI</span>
            <span className="brand-tag">Intelligent interview readiness</span>
          </div>
        </button>

        <nav className="site-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            Dashboard
          </NavLink>
          <NavLink to="/generate-resume" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            Generate Resume
          </NavLink>
          <NavLink to="/generate-report" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            Job Analyzer
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            About
          </NavLink>
        </nav>

        <div className="header-actions">
          {loading ? (
            <span className="status-pill">Loading...</span>
          ) : user ? (
            <>
              <span className="status-pill user-pill">{user.username}</span>
              <button className="action-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="action-btn" onClick={() => navigate("/login")}>Login</button>
              <button className="action-btn secondary" onClick={() => navigate("/register")}>Register</button>
            </>
          )}
        </div>
      </header>

      <main className="page-wrapper">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
