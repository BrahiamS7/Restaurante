export function validarIdPositivo(nombreParametro) {
  return (req, res, next) => {
    const valor = Number(req.params[nombreParametro]);

    if (typeof valor !== "number" || !Number.isInteger(valor) || valor <= 0) {
      return res.status(400).json({ msg: `${nombreParametro} inválido!` });
    }

    req[nombreParametro] = valor;
    next();
  };
}

export async function checkContenido(valor) {
  if (typeof valor !== "string" || valor.trim().length === 0) {
    return res.status(400).json({ msg: "Formato de valor invalido!" });
  }
}
