import "dotenv/config";
import cors from "cors";
import express from "express";
import adminRoutes from "./routes/admin.routes.js";
import contenidosRoutes from "./routes/contenidos.routes.js";
import mesasRoutes from "./routes/mesas.routes.js";
import pedidosRoutes from "./routes/pedidos.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import turnosRoutes from "./routes/turnos.routes.js";
import { verificarToken } from "./middleware/auth.middleware.js";
import { limitadorGeneral, limitadorLogin } from "./middleware/rateLimit.middleware.js";
import { login } from "./controllers/admin.controller.js";

const app = express();

const origenesPermitidos = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origen) => origen.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origen, callback) {
      if (!origen || origenesPermitidos.includes(origen)) {
        return callback(null, true);
      }
      return callback(new Error("Origen no permitido por CORS"));
    },
  }),
);

app.use(express.json());
app.use(limitadorGeneral);

app.get("/", (req, res) => {
  res.status(200).json({ msg: "API FUNCIONANDO!" });
});

app.post("/admin/login", limitadorLogin, login);

app.use(verificarToken);

app.use("/admin", adminRoutes);
app.use("/contenidos", contenidosRoutes);
app.use("/mesas", mesasRoutes);
app.use("/pedidos", pedidosRoutes);
app.use("/productos", productosRoutes);
app.use("/turnos", turnosRoutes);

app.use((req, res) => {
  res.status(404).json({ msg: "Ruta no encontrada" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ msg: "Error interno del servidor" });
});

export default app;
