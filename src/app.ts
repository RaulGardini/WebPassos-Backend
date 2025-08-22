import express from "express";
import cors from "cors";
import sequelize from "./config/database";
import usuarioRoutes from "./Routes/RouteUsuario";
import alunosRoutes from "./Routes/RouteAluno";
import colaboradoresRoutes from "./Routes/RouteColaborador";
import RouteCargo from "./Routes/RouteCargo";

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173" // ou a porta do seu React
}));

// Rotas
app.use("/usuarios", usuarioRoutes);
app.use("/alunos", alunosRoutes);
app.use("/colaboradores", colaboradoresRoutes);
app.use("/cargos", RouteCargo);

sequelize.authenticate()
  .then(() => console.log("✅ Conectado ao banco com sucesso!"))
  .catch(err => console.error("❌ Erro ao conectar ao banco:", err));

export default app;