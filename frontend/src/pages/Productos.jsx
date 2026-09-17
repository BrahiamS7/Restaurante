import { useEffect, useState } from "react";
import Header from "../components/Header";

import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  desactivarProducto,
} from "../services/api";

const CATEGORIAS = [
  { value: "PLATO_FUERTE", label: "Plato fuerte" },
  { value: "ENTRADA", label: "Entrada" },
  { value: "BEBIDA", label: "Bebida" },
  { value: "POSTRE", label: "Postre" },
  { value: "OTRO", label: "Otro" },
];

export default function Productos() {
  const [productos, setProductos] = useState([]);

  const [modal, setModal] = useState(null);

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("PLATO_FUERTE");

  const [productoSeleccionado, setProductoSeleccionado] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      setLoading(true);
      setError("");

      const data = await obtenerProductos();

      setProductos(data.productos);
    } catch (error) {
      setError(error.message);
      setProductos([]);
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

  function formatearCategoria(categoria) {
    return (
      CATEGORIAS.find((opcion) => opcion.value === categoria)?.label ||
      categoria
    );
  }

  function abrirCrear() {
    setNombre("");
    setPrecio("");
    setCategoria("PLATO_FUERTE");
    setProductoSeleccionado(null);
    setError("");
    setModal("crear");
  }

  function abrirEditar(producto) {
    setNombre(producto.nombre);
    setPrecio(Number(producto.precio));
    setCategoria(producto.categoria || "PLATO_FUERTE");
    setProductoSeleccionado(producto);
    setError("");
    setModal("editar");
  }

  function cerrarModal() {
    setModal(null);
    setNombre("");
    setPrecio("");
    setCategoria("PLATO_FUERTE");
    setProductoSeleccionado(null);
    setError("");
  }

  async function guardarProducto(event) {
    event.preventDefault();

    try {
      setGuardando(true);
      setError("");

      if (modal === "crear") {
        await crearProducto(nombre, precio, categoria);
      } else {
        await actualizarProducto(
          productoSeleccionado.id,
          nombre,
          precio,
          categoria
        );
      }

      cerrarModal();
      await cargarProductos();
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  }

  async function handleDesactivar(producto) {
    const confirmar = window.confirm(
      `¿Seguro que deseas desactivar "${producto.nombre}"?`
    );

    if (!confirmar) return;

    try {
      setError("");

      await desactivarProducto(producto.id);

      await cargarProductos();
    } catch (error) {
      setError(error.message);
    }
  }

  if (loading) {
    return (
      <div className="loading">
        Cargando productos...
      </div>
    );
  }

  return (
    <>
      <Header
        title="Productos"
        subtitle="Administra el menú del restaurante"
      />

      <main className="page-content">

        <div className="page-toolbar">

          <div>
            <h2>Catálogo</h2>
            <p>
              {productos.length} productos activos
            </p>
          </div>

          <button
            className="primary-small-button"
            onClick={abrirCrear}
          >
            + Nuevo producto
          </button>

        </div>

        {error && !modal && (
          <div className="error-message">
            {error}
          </div>
        )}

        {productos.length === 0 ? (
          <div className="empty-state">
            <div>◆</div>

            <h2>No hay productos</h2>

            <p>
              Crea el primer producto del restaurante.
            </p>
          </div>
        ) : (
          <div className="productos-grid">

            {productos.map((producto) => (
              <div
                className="producto-card"
                key={producto.id}
              >

                <div className="producto-top">

                  <div className="producto-icon">
                    ◆
                  </div>

                  <span className="producto-active">
                    Activo
                  </span>

                </div>

                <h3>{producto.nombre}</h3>
                <span className="producto-categoria">
                  {formatearCategoria(producto.categoria)}
                </span>

                <strong className="producto-price">
                  {formatearPrecio(producto.precio)}
                </strong>

                <div className="producto-actions">

                  <button
                    className="edit-button"
                    onClick={() =>
                      abrirEditar(producto)
                    }
                  >
                    Editar
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDesactivar(producto)
                    }
                  >
                    Desactivar
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </main>

      {modal && (
        <div className="modal-overlay">

          <div className="modal">

            <button
              className="modal-close"
              onClick={cerrarModal}
            >
              ×
            </button>

            <div className="modal-icon">
              ◆
            </div>

            <h2>
              {modal === "crear"
                ? "Nuevo producto"
                : "Editar producto"}
            </h2>

            <p>
              {modal === "crear"
                ? "Agrega un producto al menú."
                : "Modifica la información del producto."}
            </p>

            <form onSubmit={guardarProducto}>

              <label>
                Nombre
              </label>

              <input
                type="text"
                value={nombre}
                onChange={(event) =>
                  setNombre(event.target.value)
                }
                placeholder="Ej. Hamburguesa clásica"
                required
              />

              <label>
                Precio
              </label>

              <input
                type="number"
                min="1"
                step="0.01"
                value={precio}
                onChange={(event) =>
                  setPrecio(event.target.value)
                }
                placeholder="Ej. 25000"
                required
              />

              <label>
                Categoría
              </label>

              <select
                value={categoria}
                onChange={(event) =>
                  setCategoria(event.target.value)
                }
                required
              >
                {CATEGORIAS.map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </select>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="primary-button"
                disabled={guardando}
              >
                {guardando
                  ? "Guardando..."
                  : modal === "crear"
                    ? "Crear producto"
                    : "Guardar cambios"}
              </button>

            </form>

          </div>

        </div>
      )}
    </>
  );
}