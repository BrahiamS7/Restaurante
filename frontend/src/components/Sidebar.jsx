import { NavLink, useNavigate } from "react-router-dom";
import LogoMark from "../components/LogoMark.jsx";
export default function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const menuItems = [
    { path: "/dashboard", icon: "▣", label: "Dashboard" },
    { path: "/mesas", icon: "▦", label: "Mesas" },
    { path: "/pedidos", icon: "▤", label: "Pedidos" },
    { path: "/productos", icon: "◆", label: "Productos" },
    { path: "/meseros", icon: "●", label: "Meseros" },
    { path: "/turnos", icon: "◷", label: "Turnos" },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <LogoMark size={42} />
        <div>
          <h2>La Brasa</h2>
          <span>Parrilla &amp; asador</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="menu-title">Secciones</p>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="logout-button" onClick={handleLogout}>
          <span>↪</span>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}