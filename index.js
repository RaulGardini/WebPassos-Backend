const express = require('express');
const cors = require('cors');
const alunosRoutes = require('./routes/alunos');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/alunos', alunosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});