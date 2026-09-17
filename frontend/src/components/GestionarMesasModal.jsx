import { useEffect, useState } from "react";
import { obtenerTodasLasMesas, desactivarMesa, reactivarMesa } from "../services/api";

export default function GestionarMesasModal({ onClose, onCambio }) {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarMesas();
  }, []);

  async function cargarMesas() {
    try {
      setLoading(true);
      setError("");

      const data = await obtenerTodasLasMesas();
      setMesas(data.mesas);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(mesa) {
    const confirmar = window.confirm(
      mesa.activo
        ? `¿Desactivar la mesa ${mesa.id}?`
        : `¿Reactivar la mesa ${mesa.id}?`
    );
    if (!confirmar) return;

    try {
      setError("");

      if (mesa.activo) {
        await desactivarMesa(mesa.id);
      } else {
        await reactivarMesa(mesa.id);
      }

      await cargarMesas();
      onCambio(); // avisa al tablero principal que recargue
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal turno-modal">
        <div className="turno-modal-header">
          <div>
            <span className="detail-label">Gestión</span>
            <h2>Mesas del restaurante</h2>
          </div>

          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="turno-modal-pedidos">
          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <p>Cargando mesas...</p>
          ) : (
            <div className="mesas-grid">
              {mesas.map((mesa) => (
                <div
                  key={mesa.id}
                  className={`mesa-card mesa-${mesa.estadoM.toLowerCase()}`}
                >
                  <div className="mesa-number">{mesa.id}</div>

                  <div className="mesa-info">
                    <strong>Mesa {mesa.id}</strong>
                    <span className={mesa.activo ? "estado-activo" : "estado-inactivo"}>
                      {mesa.activo ? "Activa" : "Inactiva"}
                    </span>

                    <button
                      className={mesa.activo ? "delete-button" : "edit-button"}
                      onClick={() => handleToggle(mesa)}
                      style={{ marginTop: "10px" }}
                    >
                      {mesa.activo ? "Desactivar" : "Reactivar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}