
const {getPlatillos, actualizarDisponible, getRestaurantes, usuarioConectado, restaurantConectado, getPlatillosRestaurant} = require("../controllers/sockets");
const { comprobarJWT } = require("../helpers/generarJWT");

class Sockets {

    constructor(io){

        this.io = io;

        this.socketEvents();
    }

    socketEvents(){
        //ON connection
        this.io.on('connection', async (socket) => {

            const [valido, uidRestaurant] = comprobarJWT(socket.handshake.query['x-token']);

            const [userValido, uidUser] = comprobarJWT(socket.handshake.query['x-token']);

            console.log(valido)

            if(!valido){
                console.log('Socket no identificado');
                return socket.disconnect();
            }

            await restaurantConectado(uidRestaurant);


            if(!userValido){
                console.log('Socket no identificado')
            }
            
            await usuarioConectado(uidUser)

            //TODO: Recibir un nuevo pedidio de cliente
            

            //TODO: Emitir lista de restaurantes
            this.io.emit('lista-restaurantes', await getRestaurantes())


            //TODO: Emitir toda la lista de platillos
            this.io.emit('lista-platillos', await getPlatillos())


            //TODO: Emitir toda lista de platillos por restaurant
            socket.emit('platillos-restaurant', await getPlatillosRestaurant(uidRestaurant))


            //TODO: Actualizar el estado disponible de algun platillo por medio de su ID
            socket.on('actualizar-disponible', async (payload) => {
                
                const platillo = await actualizarDisponible(payload);
                
                this.io.emit('actualizar-disponible', await getPlatillosRestaurant(uidRestaurant));
                
            })


            socket.on('disconnect', ()=>{
                console.log('desconectado')
            })
        })
    }
}

module.exports = Sockets;