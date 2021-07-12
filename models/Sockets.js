
const {getPlatillos, actualizarDisponible, getRestaurantes, getPlatillosRestaurant, usuarioConectado, usuarioDesconectado} = require("../controllers/sockets");
const { comprobarJWT } = require("../helpers/generarJWT");

class Sockets {

    constructor(io){

        this.io = io;

        this.socketEvents();
    }

    socketEvents(){
        //ON connection
        this.io.on('connection', async (socket) => {

                const [valido, uid, tipo] = comprobarJWT(socket.handshake.query['x-token'])

                console.log('conectado', uid);
                
                if(!valido){
                    console.log('Socket no identificado')
                    return socket.disconnect();
                }
    
                const usuario = await usuarioConectado(uid, tipo)

                console.log('Se conectó ', usuario.nombre);
               
                //TODO: Emitir lista de restaurantes
                this.io.emit('lista-restaurantes', await getRestaurantes())
                

                //TODO: Emitir toda la lista de platillos
                this.io.emit('lista-platillos', await getPlatillos())

                
                //TODO: Emitir toda lista de platillos por restaurant
                socket.emit('platillos-restaurant', await getPlatillosRestaurant(uid))

                
                socket.on('platillos-usuario', async (payload)=>{
                    console.log("RECIBIMOS UID de RESTAURANTE",payload)

                    const {uid} = payload;

                    this.io.emit('platillos-usuario', await getPlatillosRestaurant(uid))
                })


                //TODO: Actualizar el estado disponible de algun platillo por medio de su ID
                socket.on('actualizar-disponible', async (payload) => {
                    
                    const {restaurant} = payload;

                    const plato = await actualizarDisponible(payload);

                    this.io.emit('plato-actualizado', plato);
                    
                    this.io.emit('actualizar-disponible', await getPlatillosRestaurant(restaurant));
                    
                })

                //TODO: Recibir un nuevo pedidio de cliente
                socket.on('nuevo-pedido', async (payload) => {
                    console.log(payload)
                })

            socket.on('disconnect', async ()=>{
                console.log('desconectado')

                await usuarioDesconectado(uid);
            })
        })
    }
}

module.exports = Sockets;