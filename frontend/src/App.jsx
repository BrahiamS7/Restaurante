import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ThemeToggle from "./components/ThemeToggle";

import { ThemeProvider } from "./context/ThemeContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Mesas from "./pages/Mesas";
import Pedidos from "./pages/Pedidos";
import PedidoDetalle from "./pages/PedidoDetalle";
import Productos from "./pages/Productos";
import Meseros from "./pages/Meseros";
import Turnos from "./pages/Turnos";

function ProtectedLayout() {
  const authenticated = Boolean(localStorage.getItem("token"));

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <ThemeToggle />

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/mesas" element={<Mesas />} />

          <Route path="/pedidos" element={<Pedidos />} />

          <Route path="/pedidos/:id" element={<PedidoDetalle />} />

          <Route path="/productos" element={<Productos />} />

          <Route path="/meseros" element={<Meseros />} />

          <Route path="/turnos" element={<Turnos />} />

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}