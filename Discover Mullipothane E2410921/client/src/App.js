import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { ItineraryProvider } from "./context/ItineraryContext";
import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import PlaceDetail from "./pages/PlaceDetail";
import MapView from "./pages/MapView";
import DayPlan from "./pages/DayPlan";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPlaceForm from "./pages/AdminPlaceForm";

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [auth, setAuth] = useState({ authenticated: false });
  const location = useLocation();

  useEffect(() => {
    fetch("/api/auth/check", { credentials: "include" })
      .then((r) => r.json())
      .then(setAuth)
      .catch(() => {});
  }, [location]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setAuth({ authenticated: false });
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-brand">
          Discover <span>Mullipothane</span>
        </Link>
        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? "\u2715" : "\u2630"}
        </button>
        <nav className={`header-nav${mobileOpen ? " open" : ""}`}>
          <NavLink to="/" onClick={() => setMobileOpen(false)} className={({ isActive }) => isActive ? "active" : ""}>
            Home
          </NavLink>
          <NavLink to="/catalogue" onClick={() => setMobileOpen(false)} className={({ isActive }) => isActive ? "active" : ""}>
            Catalogue
          </NavLink>
          <NavLink to="/map" onClick={() => setMobileOpen(false)} className={({ isActive }) => isActive ? "active" : ""}>
            Map
          </NavLink>
          <NavLink to="/my-day" onClick={() => setMobileOpen(false)} className={({ isActive }) => isActive ? "active" : ""}>
            My Day Plan
          </NavLink>
          {auth.authenticated ? (
            <>
              <NavLink to="/admin" onClick={() => setMobileOpen(false)} className={({ isActive }) => isActive ? "active" : ""}>
                Dashboard
              </NavLink>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }}>Logout</button>
            </>
          ) : (
            <NavLink to="/admin/login" className="admin-link" onClick={() => setMobileOpen(false)}>
              Admin
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>
        <strong>Discover Mullipothane</strong> &mdash; a student project for ITE2953 Programming Group Project 25S2.
      </p>
      <p>
        Not an official government tourism portal. Map data &copy;{" "}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
          OpenStreetMap contributors
        </a>{" "}
        (ODbL).
      </p>
      <p style={{ marginTop: "0.5rem", fontSize: "0.75rem" }}>
        Developed by M. F. F. Afrina (E2410921)
      </p>
    </footer>
  );
}

function App() {
  return (
    <ItineraryProvider>
      <BrowserRouter>
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/place/:id" element={<PlaceDetail />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/my-day" element={<DayPlan />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/places/new" element={<AdminPlaceForm />} />
            <Route path="/admin/places/:id/edit" element={<AdminPlaceForm />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </ItineraryProvider>
  );
}

export default App;
