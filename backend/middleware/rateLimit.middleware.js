import rateLimit from "express-rate-limit";

export const limitadorGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { msg: "Demasiadas solicitudes, intenta de nuevo más tarde." },
});

export const limitadorLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    msg: "Demasiados intentos de inicio de sesión, intenta de nuevo más tarde.",
  },
});
