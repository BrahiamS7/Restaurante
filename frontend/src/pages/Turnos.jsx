import { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  crearTurno,
  obtenerTurnos,
  obtenerTurnoActual,
  cerrarTurno,
  obtenerTurnoPorId,
} from "../services/api";

export default function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [turnoActual, setTurnoActual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [pedidoExpandido, setPedidoExpandido] = useState(null);

  useEffect(() => {
    cargarTurnos();
  }, []);

  function aplicarFiltro(event) {
    event.preventDefault();
    cargarTurnos();
  }

  function limpiarFiltro() {
    setFechaDesde("");
    setFechaHasta("");
  }

  async function cargarTurnos() {
    try {
      setLoading(true);
      setError("");

      const historial = await obtenerTurnos(fechaDesde, fechaHasta);
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

  async function handleVerTurno(id) {
    try {
      setCargandoDetalle(true);
      setError("");

      const data = await obtenerTurnoPorId(id);

      setTurnoSeleccionado(data.turno);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargandoDetalle(false);
    }
  }

  function cerrarModal() {
    setTurnoSeleccionado(null);
    setPedidoExpandido(null);
  }
  function togglePedido(pedidoId) {
    setPedidoExpandido((actual) => (actual === pedidoId ? null : pedidoId));
  }
  async function handleCerrarTurno() {
    if (!turnoActual) return;

    const confirmar = window.confirm(
      `¿Seguro que deseas cerrar el turno #${turnoActual.id}?`,
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
    }).format(Number(precio || 0));
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
        {error && <div className="error-message">{error}</div>}

        {/* TURNO ACTUAL */}
        <section className="turno-actual-card">
          <div className="turno-actual-info">
            <div className="turno-icon">◷</div>

            <div>
              <span className="turno-label">Turno actual</span>

              {turnoActual ? (
                <>
                  <h2>Turno #{turnoActual.id}</h2>

                  <p>Abierto desde {formatearFecha(turnoActual.inicio)}</p>
                </>
              ) : (
                <>
                  <h2>No hay turno abierto</h2>

                  <p>Abre un turno para comenzar a registrar pedidos.</p>
                </>
              )}
            </div>
          </div>

          <div className="turno-actual-actions">
            {turnoActual ? (
              <>
                <div className="turno-total">
                  <span>Total acumulado</span>

                  <strong>{formatearPrecio(turnoActual.total)}</strong>
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
        <form
          onSubmit={aplicarFiltro}
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "flex-end",
            marginBottom: "20px",
          }}
        >
          <div className="form-field">
            <label>Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </div>

          <button type="submit" className="secondary-button">
            Buscar
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={limpiarFiltro}
          >
            Limpiar
          </button>
        </form>
        {/* HISTORIAL */}
        <div className="page-toolbar turnos-toolbar">
          <div>
            <h2>Historial de turnos</h2>

            <p>{turnos.length} turnos registrados</p>
          </div>

          <button className="secondary-button" onClick={cargarTurnos}>
            ↻ Actualizar
          </button>
        </div>

        {turnos.length === 0 ? (
          <div className="empty-state">
            <div>◷</div>

            <h2>No hay turnos registrados</h2>

            <p>Los turnos aparecerán aquí después de abrir el primero.</p>
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
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {turnos.map((turno) => (
                  <tr key={turno.id}>
                    <td>
                      <strong>#{turno.id}</strong>
                    </td>

                    <td>{formatearFecha(turno.inicio)}</td>

                    <td>{formatearFecha(turno.fin)}</td>

                    <td>
                      <span
                        className={`turno-status ${turno.estado.toLowerCase()}`}
                      >
                        {turno.estado === "ABIERTO" ? "Abierto" : "Cerrado"}
                      </span>
                    </td>

                    <td>
                      <strong>{formatearPrecio(turno.total)}</strong>
                    </td>

                    <td>
                      <button
                        className="secondary-button"
                        onClick={() => handleVerTurno(turno.id)}
                        disabled={cargandoDetalle}
                      >
                        {cargandoDetalle ? "Cargando..." : "Ver detalle"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {turnoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div
            className="turno-modal"
            onClick={(event) => event.stopPropagation()}
          >
            {/* HEADER */}
            <div className="turno-modal-header">
              <div>
                <span className="turno-label">Detalle del turno</span>

                <h2>Turno #{turnoSeleccionado.id}</h2>
              </div>

              <button className="modal-close-button" onClick={cerrarModal}>
                ×
              </button>
            </div>

            {/* INFORMACIÓN DEL TURNO */}
            <div className="turno-modal-info">
              <div className="turno-info-item">
                <span>Estado</span>

                <strong>
                  <span
                    className={`turno-status ${turnoSeleccionado.estado.toLowerCase()}`}
                  >
                    {turnoSeleccionado.estado === "ABIERTO"
                      ? "Abierto"
                      : "Cerrado"}
                  </span>
                </strong>
              </div>

              <div className="turno-info-item">
                <span>Inicio</span>

                <strong>{formatearFecha(turnoSeleccionado.inicio)}</strong>
              </div>

              <div className="turno-info-item">
                <span>Fin</span>

                <strong>{formatearFecha(turnoSeleccionado.fin)}</strong>
              </div>

              <div className="turno-info-item">
                <span>Total</span>

                <strong className="turno-modal-total">
                  {formatearPrecio(turnoSeleccionado.total)}
                </strong>
              </div>
            </div>

            {/* PEDIDOS */}
            <div className="turno-modal-pedidos">
              <div className="pedidos-header">
                <div>
                  <h3>Pedidos del turno</h3>

                  <p>
                    {turnoSeleccionado.pedidos?.length || 0} pedidos registrados
                  </p>
                </div>
              </div>

              {!turnoSeleccionado.pedidos ||
              turnoSeleccionado.pedidos.length === 0 ? (
                <div className="empty-pedidos">
                  <div className="empty-pedidos-icon">🧾</div>

                  <h3>No hay pedidos</h3>

                  <p>Este turno todavía no tiene pedidos.</p>
                </div>
              ) : (
                <div className="pedidos-list">
                  {turnoSeleccionado.pedidos.map((pedido) => {
                    const expandido = pedidoExpandido === pedido.id;

                    return (
                      <div
                        key={pedido.id}
                        className={`pedido-card ${
                          expandido ? "pedido-card-expanded" : ""
                        }`}
                      >
                        {/* CABECERA DEL PEDIDO */}
                        <button
                          className="pedido-card-header"
                          onClick={() => togglePedido(pedido.id)}
                        >
                          <div className="pedido-card-title">
                            <div className="pedido-number">#{pedido.id}</div>

                            <div>
                              <strong>Pedido #{pedido.id}</strong>
                              <span>
                                Mesa {pedido.mesa?.id || "—"} ·{" "}
                                {pedido.mesero?.nombre || "—"}
                              </span>
                            </div>
                          </div>

                          <div className="pedido-card-right">
                            <strong>{formatearPrecio(pedido.total)}</strong>

                            <span
                              className={`pedido-arrow ${
                                expandido ? "rotated" : ""
                              }`}
                            >
                              ▾
                            </span>
                          </div>
                        </button>

                        {/* CONTENIDO EXPANDIDO */}
                        {expandido && (
                          <div className="pedido-card-body">
                            {/* INFORMACIÓN DEL PEDIDO */}
                            <div className="pedido-extra-info">
                              <div>
                                <span>Estado</span>

                                <strong>{pedido.estado}</strong>
                              </div>

                              <div>
                                <span>Mesa</span>

                                <strong>#{pedido.mesa?.id ?? "—"}</strong>
                              </div>

                              <div>
                                <span>Mesero</span>

                                <strong>{pedido.mesero?.nombre || "—"}</strong>
                              </div>
                            </div>

                            {/* PRODUCTOS */}
                            <div className="productos-title">Productos</div>

                            <div className="pedido-productos">
                              <div className="pedido-productos-header">
                                <span>Producto</span>
                                <span>Cantidad</span>
                                <span>Precio</span>
                                <span>Subtotal</span>
                              </div>

                              {pedido.contenidos?.map((contenido) => {
                                const subtotal =
                                  Number(contenido.precio) * contenido.cantidad;

                                return (
                                  <div
                                    className="pedido-producto"
                                    key={contenido.id}
                                  >
                                    <div className="producto-info">
                                      <strong>
                                        {contenido.producto?.nombre ||
                                          "Producto"}
                                      </strong>

                                      {contenido.observaciones && (
                                        <small>{contenido.observaciones}</small>
                                      )}
                                    </div>

                                    <div className="producto-cantidad">
                                      {contenido.cantidad}
                                    </div>

                                    <div className="producto-precio">
                                      {formatearPrecio(contenido.precio)}
                                    </div>

                                    <div className="producto-subtotal">
                                      <strong>
                                        {formatearPrecio(subtotal)}
                                      </strong>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* TOTAL PEDIDO */}
                            <div className="pedido-total">
                              <span>Total del pedido</span>

                              <strong>{formatearPrecio(pedido.total)}</strong>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="turno-modal-footer">
              <button className="secondary-button" onClick={cerrarModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
