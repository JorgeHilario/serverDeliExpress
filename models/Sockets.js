
const {getPlatillos, actualizarDisponible, getRestaurantes, restaurantConectado, getPlatillosRestaurant} = require("../controllers/sockets");
const { comprobarJWT } = require("../helpers/generarJWT");

class Sockets {

    constructor(io){

        this.io = io;

        this.socketEvents();
    }

    socketEvents(){
        //ON connection
        this.io.on('connection', async (socket) => {

            const [valido, uid] = comprobarJWT(socket.handshake.query['x-token']);

            console.log('Conectado')

            if(!valido){
                console.log('Socket no identificado');
                return socket.disconnect();
            }

            await restaurantConectado(uid);


            //TODO: Recibir un nuevo pedidio de cliente
            

            //TODO: Emitir lista de restaurantes
            this.io.emit('lista-restaurantes', await getRestaurantes())


            //TODO: Emitir toda la lista de platillos
            this.io.emit('lista-platillos', await getPlatillos())


            //TODO: Emitir toda lista de platillos por restaurant
            socket.emit('platillos-restaurant', await getPlatillosRestaurant(uid))


            //TODO: Actualizar el estado disponible de algun platillo por medio de su ID
            socket.on('actualizar-disponible', async (payload) => {
                
                const platillo = await actualizarDisponible(payload);
                
                this.io.emit('actualizar-disponible', await getPlatillosRestaurant(uid));
                
            })


            socket.on('disconnect', ()=>{
                console.log('desconectado')
            })
        })
    }
}

module.exports = Sockets;