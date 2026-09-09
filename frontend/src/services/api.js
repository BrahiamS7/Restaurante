const API_URL = "http://localhost:3000";

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || data.error || "Ocurrió un error");
  }

  return data;
}

export async function login(usuario, password) {
  return apiRequest("/admin/login", {
    method: "POST",
    body: JSON.stringify({
      usuario,
      password,
    }),
  });
}

export async function obtenerMesas() {
  return apiRequest("/mesas");
}

export async function obtenerMeseros() {
  return apiRequest("/admin/meseros");
}

export async function crearPedido(mesero_id, mesa_id) {
  return apiRequest("/pedidos", {
    method: "POST",
    body: JSON.stringify({
      mesero_id,
      mesa_id,
    }),
  });
}

export async function obtenerTurnoActual() {
  return apiRequest("/turnos/actual");
}
export async function obtenerPedidos() {
  return apiRequest("/pedidos");
}

export async function obtenerPedidoPorId(id) {
  return apiRequest(`/pedidos/${id}`);
}

export async function actualizarEstadoPedido(id, estado) {
  return apiRequest(`/pedidos/${id}/estado`, {
    method: "PUT",
    body: JSON.stringify({
      estado,
    }),
  });
}

export async function facturarPedido(id) {
  return apiRequest(`/pedidos/${id}/facturar`, {
    method: "POST",
  });
}

export async function cancelarPedido(id) {
  return apiRequest(`/pedidos/${id}/cancelar`, {
    method: "POST",
  });
}

export async function obtenerProductos() {
  return apiRequest("/productos");
}

export async function obtenerProductoPorId(id) {
  return apiRequest(`/productos/${id}`);
}

export async function crearProducto(nombre, precio) {
  return apiRequest("/productos", {
    method: "POST",
    body: JSON.stringify({
      nombre,
      precio: Number(precio),
    }),
  });
}

export async function actualizarProducto(id, nombre, precio) {
  return apiRequest(`/productos/${id}/actualizar`, {
    method: "PUT",
    body: JSON.stringify({
      nombre,
      precio: Number(precio),
    }),
  });
}

export async function desactivarProducto(id) {
  return apiRequest(`/productos/${id}/desactivar`, {
    method: "PUT",
  });
}

export async function crearMesero(nombre) {
  return apiRequest("/admin/mesero", {
    method: "POST",
    body: JSON.stringify({
      nombre,
    }),
  });
}

export async function actualizarMesero(id, nombre) {
  return apiRequest(`/admin/mesero/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      nombre,
    }),
  });
}

export async function desactivarMesero(id) {
  return apiRequest(`/admin/mesero/${id}`, {
    method: "DELETE",
  });
}

export async function crearTurno() {
  return apiRequest("/turnos", {
    method: "POST",
  });
}

export async function obtenerTurnos() {
  return apiRequest("/turnos");
}


export async function cerrarTurno(id) {
  return apiRequest(`/turnos/${id}/cerrar`, {
    method: "POST",
  });
}

export async function obtenerTurnoPorId(id) {
  return apiRequest(`/turnos/${id}`);
}



export async function actualizarContenido(id, cantidad, observaciones) {
  return apiRequest(`/contenidos/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      cantidad: Number(cantidad),
      observaciones,
    }),
  });
}

export async function eliminarContenido(id) {
  return apiRequest(`/contenidos/${id}`, {
    method: "DELETE",
  });
}

export async function obtenerContenidosPorPedido(id) {
  return apiRequest(`/pedidos/${id}/contenidos`);
}

export async function crearContenido(
  cantidad,
  producto_id,
  pedido_id
) {
  return apiRequest("/contenidos", {
    method: "POST",
    body: JSON.stringify({
      cantidad: Number(cantidad),
      producto_id: Number(producto_id),
      pedido_id: Number(pedido_id),
    }),
  });
}
