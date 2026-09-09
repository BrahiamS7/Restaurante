import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { obtenerPedidos } from "../services/api";

export default function Pedidos() {
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarPedidos();
  }, []);

  async function cargarPedidos() {
    try {
      setLoading(true);
      setError("");

      const data = await obtenerPedidos();


      setPedidos(data.pedidosConTotal || []);
    } catch (error) {
      setPedidos([]);
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

  function obtenerTextoEstado(estado) {
    const estados = {
      PENDIENTE: "Pendiente",
      EN_PROCESO: "En proceso",
    };

    return estados[estado] || estado;
  }

  if (loading) {
    return <div className="loading">Cargando pedidos...</div>;
  }

  return (
    <>
      <Header title="Pedidos" subtitle="Gestiona los pedidos activos" />

      <main className="page-content">
        <div className="page-toolbar">
          <div>
            <h2>Pedidos activos</h2>
            <p>{pedidos.length} pedidos en curso</p>
          </div>

          <button className="secondary-button" onClick={cargarPedidos}>
            ↻ Actualizar
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {pedidos.length === 0 && !error && (
          <div className="empty-state">
            <div>▤</div>
            <h2>No hay pedidos activos</h2>
            <p>Los nuevos pedidos aparecerán aquí.</p>
          </div>
        )}

        <div className="pedidos-grid">
          {pedidos.map((pedido) => (
            <div className="pedido-card" key={pedido.id}>
              <div className="pedido-header">
                <div>
                  <span>Pedido</span>
                  <strong>#{pedido.id}</strong>
                </div>

                <span
                  className={`pedido-status ${pedido.estado.toLowerCase()}`}
                >
                  {obtenerTextoEstado(pedido.estado)}
                </span>
              </div>

              <div className="pedido-info">
                <div>
                  <span>Mesa</span>
                  <strong>#{pedido.mesa_id}</strong>
                </div>

                <div>
                  <span>Mesero</span>
                  {console.log(pedido)}
                  <strong>{pedido.mesero?.nombre || "Sin asignar"}</strong>
                </div>
              </div>

              <div className="pedido-products">
                {pedido.contenidos?.slice(0, 3).map((contenido, index) => (
                  <div key={index}>
                    <span>
                      {contenido.cantidad}x {contenido.producto?.nombre}
                    </span>

                    <strong>{formatearPrecio(contenido.precio)}</strong>
                  </div>
                ))}

                {pedido.contenidos?.length > 3 && (
                  <small>+{pedido.contenidos.length - 3} productos más</small>
                )}
              </div>

              <div className="pedido-footer">
                <div>
                  <span>Total</span>
                  <strong>
                    {formatearPrecio(pedido.totalActual ?? pedido.total)}
                  </strong>
                </div>

                <button
                  className="primary-small-button"
                  onClick={() => navigate(`/pedidos/${pedido.id}`)}
                >
                  Ver pedido
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
