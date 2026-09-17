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
import { login } from "./controllers/admin.controller.js";

const app = express();
app.use(
  cors({
    origin: "*",
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ msg: "API FUNCIONANDO!" });
});

app.post("/admin/login", login);

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
