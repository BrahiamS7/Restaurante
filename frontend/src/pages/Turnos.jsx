import { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  crearTurno,
  obtenerTurnos,
  obtenerTurnoActual,
  cerrarTurno,
} from "../services/api";

export default function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [turnoActual, setTurnoActual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarTurnos();
  }, []);

  async function cargarTurnos() {
    try {
      setLoading(true);
      setError("");

      const historial = await obtenerTurnos();
      setTurnos(historial.turnos);

      try {
        const actual = await obtenerTurnoActual();
        setTurnoActual(actual.turno);
      } catch {
        setTurnoActual(null);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAbrirTurno() {
    try {
      setProcesando(true);
      setError("");

      await crearTurno();
      await cargarTurnos();
    } catch (error) {
      setError(error.message);
    } finally {
      setProcesando(false);
    }
  }

  async function handleCerrarTurno() {
    if (!turnoActual) return;

    const confirmar = window.confirm(
      `¿Seguro que deseas cerrar el turno #${turnoActual.id}?`
    );

    if (!confirmar) return;

    try {
      setProcesando(true);
      setError("");

      await cerrarTurno(turnoActual.id);
      await cargarTurnos();
    } catch (error) {
      setError(error.message);
    } finally {
      setProcesando(false);
    }
  }

  function formatearPrecio(precio) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(Number(precio));
  }

  function formatearFecha(fecha) {
    if (!fecha) return "—";

    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(fecha));
  }

  if (loading) {
    return <div className="loading">Cargando turnos...</div>;
  }

  return (
    <>
      <Header
        title="Turnos"
        subtitle="Gestiona la apertura y cierre de turnos"
      />

      <main className="page-content">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <section className="turno-actual-card">
          <div className="turno-actual-info">
            <div className="turno-icon">◷</div>

            <div>
              <span className="turno-label">TURNO ACTUAL</span>

              {turnoActual ? (
                <>
                  <h2>Turno #{turnoActual.id}</h2>

                  <p>
                    Abierto desde {formatearFecha(turnoActual.inicio)}
                  </p>
                </>
              ) : (
                <>
                  <h2>No hay turno abierto</h2>

                  <p>
                    Abre un turno para comenzar a registrar pedidos.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="turno-actual-actions">
            {turnoActual ? (
              <>
                <div className="turno-total">
                  <span>Total acumulado</span>

                  <strong>
                    {formatearPrecio(turnoActual.total)}
                  </strong>
                </div>

                <button
                  className="close-turno-button"
                  onClick={handleCerrarTurno}
                  disabled={procesando}
                >
                  {procesando ? "Cerrando..." : "Cerrar turno"}
                </button>
              </>
            ) : (
              <button
                className="primary-small-button"
                onClick={handleAbrirTurno}
                disabled={procesando}
              >
                {procesando ? "Abriendo..." : "Abrir turno"}
              </button>
            )}
          </div>
        </section>

        <div className="page-toolbar turnos-toolbar">
          <div>
            <h2>Historial de turnos</h2>

            <p>
              {turnos.length} turnos registrados
            </p>
          </div>

          <button
            className="secondary-button"
            onClick={cargarTurnos}
          >
            ↻ Actualizar
          </button>
        </div>

        {turnos.length === 0 ? (
          <div className="empty-state">
            <div>◷</div>

            <h2>No hay turnos registrados</h2>

            <p>
              Los turnos aparecerán aquí después de abrir el primero.
            </p>
          </div>
        ) : (
          <div className="turnos-table-container">
            <table className="turnos-table">
              <thead>
                <tr>
                  <th>Turno</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Estado</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {turnos.map((turno) => (
                  <tr key={turno.id}>
                    <td>
                      <strong>#{turno.id}</strong>
                    </td>

                    <td>
                      {formatearFecha(turno.inicio)}
                    </td>

                    <td>
                      {formatearFecha(turno.fin)}
                    </td>

                    <td>
                      <span
                        className={`turno-status ${
                          turno.estado.toLowerCase()
                        }`}
                      >
                        {turno.estado === "ABIERTO"
                          ? "Abierto"
                          : "Cerrado"}
                      </span>
                    </td>

                    <td>
                      <strong>
                        {formatearPrecio(turno.total)}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}