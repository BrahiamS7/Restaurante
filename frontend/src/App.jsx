import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Mesas from "./pages/Mesas";
import Pedidos from "./pages/Pedidos";
import PedidoDetalle from "./pages/PedidoDetalle";
import Productos from "./pages/Productos";
import Meseros from "./pages/Meseros";
import Turnos from "./pages/Turnos";

function ProtectedLayout() {
  const authenticated = localStorage.getItem("authenticated") === "true";

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/mesas" element={<Mesas />} />

          <Route path="/pedidos" element={<Pedidos />} />

          <Route path="/pedidos/:id" element={<PedidoDetalle />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />

          <Route path="/productos" element={<Productos />} />

          <Route path="/meseros" element={<Meseros />} />

          <Route path="/turnos" element={<Turnos />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
