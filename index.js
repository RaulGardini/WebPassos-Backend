const express = require('express');
const cors = require('cors');
const alunosRoutes = require('./routes/alunos');
const colaboradoresRoutes = require('./routes/colaboradores');
const usuariosRoutes = require('./routes/usuarios');
const turmasRoutes = require('./routes/turmas');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/alunos', alunosRoutes);
app.use('/colaboradores', colaboradoresRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/turmas', turmasRoutes);

app.get('/test', (req, res) => {
  res.json({ message: 'Servidor funcionando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});