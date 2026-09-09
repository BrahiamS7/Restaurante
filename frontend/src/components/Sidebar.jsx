import { NavLink } from "react-router-dom";

export default function Sidebar() {
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
        <div className="brand-icon">R</div>

        <div>
          <h2>RESTAURANTE</h2>
          <span>POS SYSTEM</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="menu-title">MENÚ PRINCIPAL</p>

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
        <button className="logout-button">
          <span>↪</span>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}