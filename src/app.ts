import express from "express";
import cors from "cors";
import sequelize from "./config/database";
import usuarioRoutes from "./routes/usuarioRoutes";

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173" // ou a porta do seu React
}));

// Rotas
app.use("/usuarios", usuarioRoutes);

sequelize.authenticate()
  .then(() => console.log("✅ Conectado ao banco com sucesso!"))
  .catch(err => console.error("❌ Erro ao conectar ao banco:", err));

export default app;