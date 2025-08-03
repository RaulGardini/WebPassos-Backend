const express = require('express');
const cors = require('cors');
const alunosRoutes = require('./routes/alunos');
const colaboradoresRoutes = require('./routes/colaboradores');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/alunos', alunosRoutes);
app.use('/colaboradores', colaboradoresRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});