require('dotenv').config();
const express = require('express');
const path = require('path');
const connectToDatabase = require('./src/database/connect');

const app = express();

// Conexão com o banco
connectToDatabase();

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',                       // frontend local Vite
  'http://192.168.56.1:3000',                    // frontend local servindo dist
  'https://meu-pet.onrender.com'  // frontend remoto Render
];

// Middleware universal de CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Responde OPTIONS imediatamente
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

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
