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
