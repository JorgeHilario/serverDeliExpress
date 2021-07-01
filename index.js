
const Server = require('./models/Server');

//Leer y establecer variables de entorno
require('dotenv').config();

//Inicializar instancia del servidor
const server = new Server();

//Ejecutar el servidor
server.execute();