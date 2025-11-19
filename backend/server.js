require('dotenv').config();
const express = require('express');
const path = require('path');
const connectToDatabase = require('./src/database/connect');
const cors = require('cors');

const app = express();

// Conexão com o banco
connectToDatabase();

// Middlewares
const allowedOrigins = [
  'http://localhost:5173', // frontend local Vite
  'http://192.168.1.4:5173', // frontend local acesso remoto (mobile)
  'http://192.168.56.1:3000', // frontend local dist
  'https://meupet-cadastrodeanimais.onrender.com' // frontend remoto Render
];

// Middleware
// app.use(cors({
//   origin: function(origin, callback){
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.includes(origin)){
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
//   allowedHeaders: ['Content-Type','Authorization']
// }));
app.use(cors({
  origin: function(origin, callback){
    if (!origin) return callback(null, true);

    if (origin.startsWith('http://192.168.')) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

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
