import { useEffect, useState } from "react";
import Header from "../components/Header";
import MesaCard from "../components/MesaCard";
import {
  obtenerMesas,
  obtenerMeseros,
  crearPedido,
} from "../services/api";

export default function Mesas() {
  const [mesas, setMesas] = useState([]);
  const [meseros, setMeseros] = useState([]);

  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [meseroSeleccionado, setMeseroSeleccionado] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      setLoading(true);

      const [mesasData, meserosData] = await Promise.all([
        obtenerMesas(),
        obtenerMeseros(),
      ]);

      setMesas(mesasData.mesas);
      setMeseros(meserosData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function seleccionarMesa(mesa) {
    if (mesa.estadoM !== "LIBRE") {
      return;
    }

    setMesaSeleccionada(mesa);
    setMeseroSeleccionado("");
  }

  async function handleCrearPedido() {
    if (!mesaSeleccionada || !meseroSeleccionado) {
      return;
    }

    try {
      await crearPedido(
        Number(meseroSeleccionado),
        mesaSeleccionada.id
      );

      setMesaSeleccionada(null);
      setMeseroSeleccionado("");

      await cargarDatos();
    } catch (error) {
      setError(error.message);
    }
  }

  if (loading) {
    return (
      <div className="loading">
        Cargando mesas...
      </div>
    );
  }

  return (
    <>
      <Header
        title="Mesas"
        subtitle="Gestiona las mesas del restaurante"
      />

      <main className="page-content">

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="mesa-legend">
          <span>
            <i className="legend-dot libre"></i>
            Libre
          </span>

          <span>
            <i className="legend-dot ocupado"></i>
            Ocupada
          </span>

          <span>
            <i className="legend-dot reservada"></i>
            Reservada
          </span>
        </div>

        <div className="mesas-grid">
          {mesas.map((mesa) => (
            <MesaCard
              key={mesa.id}
              mesa={mesa}
              onClick={seleccionarMesa}
            />
          ))}
        </div>

      </main>

      {mesaSeleccionada && (
        <div className="modal-overlay">

          <div className="modal">

            <button
              className="modal-close"
              onClick={() => setMesaSeleccionada(null)}
            >
              ×
            </button>

            <div className="modal-icon">
              {mesaSeleccionada.id}
            </div>

            <h2>Mesa {mesaSeleccionada.id}</h2>

            <p>
              Selecciona el mesero encargado de esta mesa.
            </p>

            <label>Mesero</label>

            <select
              value={meseroSeleccionado}
              onChange={(event) =>
                setMeseroSeleccionado(event.target.value)
              }
            >
              <option value="">
                Seleccionar mesero
              </option>

              {meseros.map((mesero) => (
                <option
                  key={mesero.id}
                  value={mesero.id}
                >
                  {mesero.nombre}
                </option>
              ))}
            </select>

            <button
              className="primary-button"
              disabled={!meseroSeleccionado}
              onClick={handleCrearPedido}
            >
              Crear pedido
            </button>

          </div>

        </div>
      )}
    </>
  );
}