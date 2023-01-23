import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";

import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";

import conectarDB from "./config/db.js";

const app = express();

app.use(express.json());

dotenv.config();

conectarDB();

// Configurar CORS
const whitelist = process.env.CORSWHITELIST;

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      // Puede consultar la API
      callback(null, true);
    } else {
      callback(new Error(`CORS: petición bloqueada para el origin: ${origin}. No se encuentra en la whitelist.`));
    }
  }
}

app.use(cors(corsOptions));

// Routing
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/tareas', tareaRoutes);

const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL
  }
});

io.on('connection', socket => {
  console.log('Conectado a socket.io');

  // Definir los eventos de socket io
  socket.on('abrir proyecto', (proyecto) => {
    socket.join(proyecto);
  })

  socket.on('nueva tarea', tarea => {
    const proyecto = tarea.proyecto;
    console.log(proyecto);
    socket.to(proyecto).emit('tarea agregada', tarea);
  })

  socket.on('eliminar tarea', tarea => {
    const proyecto = tarea.proyecto;
    socket.to(proyecto).emit('tarea eliminada', tarea);
  })

  socket.on('actualizar tarea', tarea => {
    const proyecto = tarea.proyecto._id;
    socket.to(proyecto).emit('tarea actualizada', tarea);
  })

  socket.on('cambiar estado', tarea => {
    const proyecto = tarea.proyecto._id;
    socket.to(proyecto).emit('nuevo estado', tarea);
  })
});
