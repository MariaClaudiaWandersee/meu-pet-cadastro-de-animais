require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectToDatabase = require('./src/database/connect');

const app = express();

// Conexão com o banco
connectToDatabase();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

app.set("view engine", "ejs");
app.set("views", "src/views");

// Rotas
const userRoutes = require('./src/routes/user.routes');
app.use('/users', userRoutes);

const animalRoutes = require('./src/routes/animal.routes');
app.use('/animals', animalRoutes);

// Porta
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
