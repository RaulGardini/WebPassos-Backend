import express from "express";
import cors from "cors";
import sequelize from "./config/database";
import usuarioRoutes from "./Routes/RouteUsuario";
import alunosRoutes from "./Routes/RouteAluno";
import colaboradoresRoutes from "./Routes/RouteColaborador";
import RouteCargo from "./Routes/RouteCargo";
import RouteModalidade from "./Routes/RouteModalidade";
import RouteSala from "./Routes/RouteSala";
import RouteHorario from "./Routes/RouteHorario";
import RouteTurma from "./Routes/RouteTurma";
import RouteHorarioTurma from "./Routes/RouteHorarioTurma";
import RouteMatricula from "./Routes/RouteMatricula";
import RouteDashboard from "./Routes/RouteDashboard";
import RouteFornecedor from "./Routes/RouteFornecedor";
import RouteChamada from "./Routes/RouteChamada";

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
app.use("/modalidades", RouteModalidade);
app.use("/salas", RouteSala);
app.use("/horarios", RouteHorario);
app.use("/turmas", RouteTurma);
app.use("/horarioTurma", RouteHorarioTurma);
app.use("/matricula", RouteMatricula);
app.use("/dashboard", RouteDashboard);
app.use("/fornecedores", RouteFornecedor);
app.use("/chamadas", RouteChamada);

sequelize.authenticate()
  .then(() => console.log("✅ Conectado ao banco com sucesso!"))
  .catch(err => console.error("❌ Erro ao conectar ao banco:", err));

export default app;