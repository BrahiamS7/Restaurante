import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import {
  obtenerPedidoPorId,
  obtenerProductos,
  obtenerContenidosPorPedido,
  crearContenido,
  eliminarContenido,
  actualizarContenido,
  facturarPedido,
  cancelarPedido,
  generarTicket,
} from "../services/api";

export default function PedidoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pedido, setPedido] = useState(null);
  const [productos, setProductos] = useState([]);
  const [contenidos, setContenidos] = useState([]);

  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [observaciones, setObservaciones] = useState("");

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [ticketVisible, setTicketVisible] = useState(false);
  const [textoTicket, setTextoTicket] = useState("");

  // --- NUEVO: estado para el modal de edición ---
  const [contenidoEditando, setContenidoEditando] = useState(null);
  const [cantidadEditada, setCantidadEditada] = useState(1);
  const [observacionesEditadas, setObservacionesEditadas] = useState("");

  useEffect(() => {
    cargarDatos();
  }, [id]);

  async function enviarACocina() {
    try {
      setGuardando(true);
      setError("");

      const resultado = await generarTicket(id);
      setTextoTicket(resultado.ticket);
      setTicketVisible(true);

      await cargarDatos();
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  }

  async function cargarDatos() {
    try {
      setLoading(true);
      setError("");

      const [pedidoData, productosData, contenidosData] = await Promise.all([
        obtenerPedidoPorId(id),
        obtenerProductos(),
        obtenerContenidosPorPedido(id),
      ]);

      setPedido(pedidoData.pedido);
      setProductos(productosData.productos);
      setContenidos(contenidosData.listaContenidos);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function formatearPrecio(precio) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(Number(precio));
  }

  async function agregarProducto(event) {
    event.preventDefault();

    if (!productoSeleccionado) {
      setError("Selecciona un producto.");
      return;
    }

    try {
      setGuardando(true);
      setError("");

      await crearContenido(cantidad, productoSeleccionado, id, observaciones);

      setProductoSeleccionado("");
      setCantidad(1);
      setObservaciones("");

      await cargarDatos();
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  }

  async function handleEliminarContenido(contenidoId) {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este producto del pedido?",
    );

    if (!confirmar) return;

    try {
      setError("");

      await eliminarContenido(contenidoId);
      await cargarDatos();
    } catch (error) {
      setError(error.message);
    }
  }

  // --- NUEVO: abrir el modal precargando los valores actuales ---
  function abrirEdicion(contenido) {
    setContenidoEditando(contenido);
    setCantidadEditada(contenido.cantidad);
    setObservacionesEditadas(contenido.observaciones || "");
    setError("");
  }

  function cerrarEdicion() {
    setContenidoEditando(null);
  }

  // --- NUEVO: guardar los cambios del modal ---
  async function guardarEdicion(event) {
    event.preventDefault();

    try {
      setGuardando(true);
      setError("");

      await actualizarContenido(
        contenidoEditando.id,
        cantidadEditada,
        observacionesEditadas,
      );

      cerrarEdicion();
      await cargarDatos();
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  }

  async function handleFacturar() {
    if (contenidos.length === 0) {
      setError("No puedes facturar un pedido vacío.");
      return;
    }

    const confirmar = window.confirm(
      "¿Seguro que deseas facturar este pedido?",
    );

    if (!confirmar) return;

    try {
      setGuardando(true);
      setError("");

      await facturarPedido(id);

      navigate("/mesas");
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  }

  async function handleCancelar() {
    const confirmar = window.confirm(
      "¿Seguro que deseas cancelar este pedido?",
    );

    if (!confirmar) return;

    try {
      setGuardando(true);
      setError("");

      await cancelarPedido(id);

      navigate("/mesas");
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  }

  const total = contenidos.reduce(
    (acumulado, contenido) => acumulado + Number(contenido.precio),
    0,
  );
  const hayNovedadesSinEnviar = contenidos.some(
    (contenido) => contenido.enviadoACocina === false,
  );

  if (loading) {
    return <div className="loading">Cargando pedido...</div>;
  }

  if (!pedido) {
    return <div className="loading">No se encontró el pedido.</div>;
  }

  return (
    <>
      <Header
        title={`Pedido #${pedido.id}`}
        subtitle={`Mesa ${pedido.mesa_id}`}
      />

      <main className="page-content">
        <button className="back-button" onClick={() => navigate("/pedidos")}>
          ← Volver a pedidos
        </button>

        {error && <div className="error-message">{error}</div>}

        <div className="pedido-builder">
          <section className="pedido-products-section">
            <div className="builder-header">
              <div>
                <span className="detail-label">Menú</span>
                <h2>Agregar productos</h2>
              </div>
            </div>

            <div className="productos-pedido-grid">
              {productos.map((producto) => (
                <button
                  key={producto.id}
                  className={`producto-pedido-card ${
                    productoSeleccionado === String(producto.id)
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => setProductoSeleccionado(String(producto.id))}
                >
                  <div className="producto-pedido-icon">◆</div>
                  <div>
                    <h3>{producto.nombre}</h3>
                    <strong>{formatearPrecio(producto.precio)}</strong>
                  </div>
                </button>
              ))}
            </div>

            <form className="producto-form" onSubmit={agregarProducto}>
              <div className="producto-form-row">
                <div className="form-field cantidad-field">
                  <label>Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(event) => setCantidad(event.target.value)}
                  />
                </div>

                <div className="form-field observaciones-field">
                  <label>Observaciones</label>
                  <input
                    type="text"
                    value={observaciones}
                    onChange={(event) => setObservaciones(event.target.value)}
                    placeholder="Ej. Sin cebolla"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="primary-button"
                disabled={!productoSeleccionado || guardando}
              >
                {guardando ? "Agregando..." : "+ Agregar al pedido"}
              </button>
            </form>
          </section>

          <aside className="pedido-resumen">
            <div className="resumen-header">
              <div>
                <span className="detail-label">Pedido</span>
                <h2>#{pedido.id}</h2>
              </div>

              <span className={`pedido-status ${pedido.estado.toLowerCase()}`}>
                {pedido.estado === "PENDIENTE" ? "Pendiente" : "En proceso"}
              </span>
            </div>

            <div className="resumen-info">
              <div>
                <span>Mesa</span>
                <strong>#{pedido.mesa_id}</strong>
              </div>

              <div>
                <span>Mesero</span>
                <strong>{pedido.mesero?.nombre || "Sin asignar"}</strong>
              </div>
            </div>

            <div className="resumen-list">
              <h3>Productos</h3>

              {contenidos.length === 0 ? (
                <div className="resumen-empty">
                  <span>▤</span>
                  <p>Todavía no hay productos en este pedido.</p>
                </div>
              ) : (
                contenidos.map((contenido) => (
                  <div className="resumen-item" key={contenido.id}>
                    <div className="resumen-item-main">
                      <strong>{contenido.cantidad}x</strong>
                      <div>
                        <span>{contenido.producto?.nombre}</span>
                        {contenido.observaciones && (
                          <small>{contenido.observaciones}</small>
                        )}
                      </div>
                    </div>

                    <div className="resumen-item-right">
                      <strong>{formatearPrecio(contenido.precio)}</strong>

                      {/* NUEVO: botón de editar */}
                      <button onClick={() => abrirEdicion(contenido)}>
                        ✎
                      </button>

                      <button
                        onClick={() => handleEliminarContenido(contenido.id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="resumen-total">
              <span>Total</span>
              <strong>{formatearPrecio(total)}</strong>
            </div>

            <div className="pedido-actions">
              {(pedido.estado === "PENDIENTE" ||
                pedido.estado === "EN_PROCESO") && (
                <button
                  className="action-button"
                  onClick={enviarACocina}
                  disabled={!hayNovedadesSinEnviar || guardando}
                >
                  <span>🔥</span>
                  {pedido.estado === "PENDIENTE"
                    ? "Enviar a cocina"
                    : "Enviar novedades"}
                </button>
              )}

              <button
                className="action-button action-success"
                onClick={handleFacturar}
                disabled={contenidos.length === 0 || guardando}
              >
                <span>✓</span>
                Facturar pedido
              </button>

              <button
                className="action-button action-danger"
                onClick={handleCancelar}
                disabled={guardando}
              >
                <span>×</span>
                Cancelar pedido
              </button>
            </div>
          </aside>
        </div>

        {ticketVisible && (
          <div className="modal-overlay">
            <div className="modal">
              <button
                className="modal-close"
                onClick={() => setTicketVisible(false)}
              >
                ×
              </button>
              <h2>Ticket de cocina</h2>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: "13px",
                  color: "#ccc",
                }}
              >
                {textoTicket}
              </pre>
            </div>
          </div>
        )}

        {/* NUEVO: modal de edición de producto */}
        {contenidoEditando && (
          <div className="modal-overlay">
            <div className="modal">
              <button className="modal-close" onClick={cerrarEdicion}>
                ×
              </button>

              <h2>Editar {contenidoEditando.producto?.nombre}</h2>

              <form className="producto-form" onSubmit={guardarEdicion}>
                <div className="producto-form-row">
                  <div className="form-field cantidad-field">
                    <label>Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      value={cantidadEditada}
                      onChange={(event) =>
                        setCantidadEditada(event.target.value)
                      }
                    />
                  </div>

                  <div className="form-field observaciones-field">
                    <label>Observaciones</label>
                    <input
                      type="text"
                      value={observacionesEditadas}
                      onChange={(event) =>
                        setObservacionesEditadas(event.target.value)
                      }
                      placeholder="Ej. Sin cebolla"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : "Guardar cambios"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}