const express = require('express');
const init = require("./db");
const cors = require('cors');
require('dotenv').config();
const usersRoute = require('./routes/users')
const loginRoute = require('./routes/login')
const booksRoute = require('./routes/books')

const PORT = 4010 

const server = express();

server.use(express.json());
server.use(cors());

server.use("/", usersRoute);
server.use("/", loginRoute);
server.use("/", booksRoute);
init();


server.listen(PORT, ()=> console.log(`Server up and running on port ${PORT}`));
