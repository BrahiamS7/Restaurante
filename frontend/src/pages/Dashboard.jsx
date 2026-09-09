import { useEffect, useState } from "react";
import Header from "../components/Header";
import { obtenerMesas, obtenerTurnoActual } from "../services/api";

export default function Dashboard() {
  const [mesas, setMesas] = useState([]);
  const [turno, setTurno] = useState(null);

  async function cargarDatos() {
    try {
      const mesasData = await obtenerMesas();

      setMesas(mesasData.mesas);

      try {
        const turnoData = await obtenerTurnoActual();
        setTurno(turnoData.turno);
      } catch {
        setTurno(null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  const libres = mesas.filter(
    (mesa) => mesa.estadoM === "LIBRE"
  ).length;

  const ocupadas = mesas.filter(
    (mesa) => mesa.estadoM === "OCUPADA"
  ).length;

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Resumen general del restaurante"
      />

      <main className="dashboard">
        <div className="stats-grid">

          <div className="stat-card">
            <span className="stat-icon">▦</span>
            <div>
              <span>Mesas totales</span>
              <strong>{mesas.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">✓</span>
            <div>
              <span>Mesas libres</span>
              <strong>{libres}</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">●</span>
            <div>
              <span>Mesas ocupadas</span>
              <strong>{ocupadas}</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">◷</span>
            <div>
              <span>Turno actual</span>
              <strong>
                {turno ? `#${turno.id}` : "Sin turno"}
              </strong>
            </div>
          </div>

        </div>

        <div className="dashboard-section">
          <div>
            <h2>Estado del restaurante</h2>
            <p>Resumen de las mesas actualmente</p>
          </div>

          <div className="quick-status">

            <div>
              <span className="status-dot libre"></span>
              <strong>{libres}</strong>
              <small>Libres</small>
            </div>

            <div>
              <span className="status-dot ocupado"></span>
              <strong>{ocupadas}</strong>
              <small>Ocupadas</small>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}