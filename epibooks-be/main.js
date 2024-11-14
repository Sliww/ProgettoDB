const express = require('express');
const init = require("./db");
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importazione delle routes
const usersRoute = require('./routes/users');
const loginRoute = require('./routes/login');
const booksRoute = require('./routes/books');
const commentsRoute = require('./routes/comments');
const googleRoute = require('./routes/google');

// Importazione dei middleware
const routeNotFoundHandler = require('./middleware/routeNotFoundHandler');
const timeForRequestMiddleware = require('./middleware/timeForRequestMiddleware');
const lockIpMiddleware = require('./middleware/lockIpMiddleware');

// Configurazioni
const PORT = process.env.PORT || 4010;
const notAllowedIp = process.env.BANNEDIP ? process.env.BANNEDIP.split(',') : [];

// Inizializzazione di Express
const server = express();

// Configurazione dei middleware
server.use(express.json());
server.use(cors());

// Middleware di sicurezza
server.use(lockIpMiddleware(notAllowedIp));
server.use(timeForRequestMiddleware);

// Definizione delle routes
server.use("/", usersRoute);
server.use("/", loginRoute);
server.use("/", booksRoute);
server.use("/", commentsRoute);
server.use("/", googleRoute);

// Gestione degli errori
server.use(routeNotFoundHandler);

// Inizializzazione del database
init();

// Avvio del server
server.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));
