const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

const Sockets = require('./Sockets')
const { dbConnection } = require ('../database/config');

class Server {

    constructor(){

        this.app = express();
        this.port = process.env.PORT;

        //CONECTAR DB
        dbConnection();

        //HTTP SERVER
        this.server = http.createServer(this.app);

        //CONFIGURACION SOCKETS
        this.io = socketio( this.server, {/* CONFIGURACIONES */} );
    }

    miMiddlewares(){

        //CORS
        this.app.use(cors());

        //PASEAR BODY
        this.app.use(express.json());

        //TODO: ADD ENDPOINTS API
        this.app.use('/ordenes', require('../routes/Ordenes'));
        this.app.use('/restaurants', require('../routes/Restaurants'));
        this.app.use('/platillos', require('../routes/Platillos'));
        this.app.use('/login', require('../routes/Usuarios'));
        this.app.use('/card', require('../routes/Cards'));
    }

    configurarSockets(){
        new Sockets(this.io);
    }

    execute(){
        //INICIALIZAR MIDDLEWARES
        this.miMiddlewares();

        //INICIALIZAR SOCKETS
        this.configurarSockets();

        //INICIALIZAR SERVER
        this.server.listen(this.port, () =>{
            console.log('Servidor corriendo en puerto: ', this.port);
        })
    }
}

module.exports = Server;