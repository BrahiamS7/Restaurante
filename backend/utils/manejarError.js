export function manejarError(error, res) {
  console.error(error);
  return res.status(500).json({ msg: "Error interno del servidor" });
}
