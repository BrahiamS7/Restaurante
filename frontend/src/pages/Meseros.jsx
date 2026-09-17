import { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  obtenerMeseros,
  crearMesero,
  actualizarMesero,
  desactivarMesero,
  reactivarMesero,
} from "../services/api";

export default function Meseros() {
  const [meseros, setMeseros] = useState([]);
  const [modal, setModal] = useState(null);
  const [nombre, setNombre] = useState("");
  const [meseroSeleccionado, setMeseroSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [pestañaActiva, setPestañaActiva] = useState("activos");

  useEffect(() => {
    cargarMeseros();
  }, [pestañaActiva]);

  async function cargarMeseros() {
    try {
      setLoading(true);
      setError("");

      const data = await obtenerMeseros(pestañaActiva === "activos");
      setMeseros(data);
    } catch (error) {
      setMeseros([]);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function abrirCrear() {
    setNombre("");
    setMeseroSeleccionado(null);
    setError("");
    setModal("crear");
  }

  function abrirEditar(mesero) {
    setNombre(mesero.nombre);
    setMeseroSeleccionado(mesero);
    setError("");
    setModal("editar");
  }

  function cerrarModal() {
    setModal(null);
    setNombre("");
    setMeseroSeleccionado(null);
    setError("");
  }

  async function guardarMesero(event) {
    event.preventDefault();

    try {
      setGuardando(true);
      setError("");

      if (modal === "crear") {
        await crearMesero(nombre);
      } else {
        await actualizarMesero(meseroSeleccionado.id, nombre);
      }

      cerrarModal();
      await cargarMeseros();
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  }

  async function handleDesactivar(mesero) {
    const confirmar = window.confirm(
      `¿Seguro que deseas desactivar a "${mesero.nombre}"?`,
    );

    if (!confirmar) return;

    try {
      setError("");

      await desactivarMesero(mesero.id);
      await cargarMeseros();
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleReactivar(mesero) {
    const confirmar = window.confirm(`¿Reactivar a "${mesero.nombre}"?`);
    if (!confirmar) return;

    try {
      setError("");
      await reactivarMesero(mesero.id);
      await cargarMeseros();
    } catch (error) {
      setError(error.message);
    }
  }

  if (loading) {
    return <div className="loading">Cargando meseros...</div>;
  }

  return (
    <>
      <Header
        title="Meseros"
        subtitle="Administra el personal del restaurante"
      />

      <main className="page-content">
        <div className="dashboard-tabs">
          <button
            className={pestañaActiva === "activos" ? "active" : ""}
            onClick={() => setPestañaActiva("activos")}
          >
            Activos
          </button>
          <button
            className={pestañaActiva === "inactivos" ? "active" : ""}
            onClick={() => setPestañaActiva("inactivos")}
          >
            Inactivos
          </button>
        </div>
        <div className="page-toolbar">
          <div>
            {pestañaActiva === "activos" ? (
              <h2>Personal activo</h2>
            ) : (
              <h2>Personal inactivo</h2>
            )}
            <p>
              {meseros.length} meseros{" "}
              {pestañaActiva === "activos" ? "activos" : "inactivos"}
            </p>
          </div>

          <div className="toolbar-actions">
            <button className="secondary-button" onClick={cargarMeseros}>
              ↻ Actualizar
            </button>

            <button className="primary-small-button" onClick={abrirCrear}>
              + Nuevo mesero
            </button>
          </div>
        </div>

        {error && !modal && <div className="error-message">{error}</div>}

        {meseros.length === 0 ? (
          <div className="empty-state">
            <div>●</div>
            <h2>No hay meseros {pestañaActiva === "activos" ? "activos" : "inactivos"}</h2>
            <p>Agrega el primer mesero del restaurante.</p>
          </div>
        ) : (
          <div className="meseros-grid">
            {meseros.map((mesero) => (
              <div className="mesero-card" key={mesero.id}>
                <div className="mesero-avatar">
                  {mesero.nombre.charAt(0).toUpperCase()}
                </div>

                <div className="mesero-info">
                  <span>Código #{mesero.id}</span>
                  <h3>{mesero.nombre}</h3>
                  <small
                    className={
                      mesero.activo ? "estado-activo" : "estado-inactivo"
                    }
                  >
                    <i></i>
                    {mesero.activo ? "Activo" : "Inactivo"}
                  </small>
                </div>

                <div className="mesero-actions">
                  <button
                    className="edit-button"
                    onClick={() => abrirEditar(mesero)}
                  >
                    Editar
                  </button>

                  {pestañaActiva === "activos" ? (
                    <button
                      className="delete-button"
                      onClick={() => handleDesactivar(mesero)}
                    >
                      Desactivar
                    </button>
                  ) : (
                    <button
                      className="edit-button"
                      onClick={() => handleReactivar(mesero)}
                    >
                      Reactivar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={cerrarModal}>
              ×
            </button>

            <div className="modal-icon">●</div>

            <h2>{modal === "crear" ? "Nuevo mesero" : "Editar mesero"}</h2>

            <p>
              {modal === "crear"
                ? "Agrega un nuevo mesero al restaurante."
                : "Modifica la información del mesero."}
            </p>

            <form onSubmit={guardarMesero}>
              <label>Nombre</label>

              <input
                type="text"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                placeholder="Ej. Carlos Rodríguez"
                required
              />

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                className="primary-button"
                disabled={guardando}
              >
                {guardando
                  ? "Guardando..."
                  : modal === "crear"
                    ? "Crear mesero"
                    : "Guardar cambios"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
