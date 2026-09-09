import "dotenv/config";
import cors from "cors";
import express from "express";
import adminRoutes from "./routes/admin.routes.js";
import contenidosRoutes from "./routes/contenidos.routes.js";
import mesasRoutes from "./routes/mesas.routes.js";
import pedidosRoutes from "./routes/pedidos.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import turnosRoutes from "./routes/turnos.routes.js";

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

app.use("/admin", adminRoutes);
app.use("/contenidos", contenidosRoutes);
app.use("/mesas", mesasRoutes);
app.use("/pedidos", pedidosRoutes);
app.use("/productos", productosRoutes);
app.use("/turnos", turnosRoutes);

export default app;
