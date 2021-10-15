
const {getPlatillos, actualizarDisponible, getRestaurantes, getPlatillosRestaurant, usuarioConectado, usuarioDesconectado, guardarPedido} = require("../controllers/sockets");
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
    
                await usuarioConectado(uid, tipo)

                socket.join( uid );
               
                //TODO: Emitir lista de restaurantes
                this.io.emit('lista-restaurantes', await getRestaurantes())
                

                //TODO: Emitir toda la lista de platillos
                this.io.emit('lista-platillos', await getPlatillos())

                
                //TODO: Emitir toda lista de platillos por restaurant
                socket.emit('platillos-restaurant', await getPlatillosRestaurant(uid))


                //TODO: Actualizar el estado disponible de algun platillo por medio de su ID
                socket.on('actualizar-disponible', async (payload) => {

                    const {restaurant} = payload;

                    const platillos = await actualizarDisponible(payload);

                    this.io.emit('platos-actualizados', {platillos, restaurant});
                    
                    this.io.to( payload.restaurant ).emit('actualizar-disponible', platillos);
                    
                })

                //TODO: Recibir un nuevo pedidio de cliente
                socket.on('nuevo-pedido', async (payload) => {
                    
                    console.log('PAYLOAD SOCKET', payload)

                    const pedido = await guardarPedido(payload);

                    this.io.to(payload.para).emit('nuevo-pedido', pedido);
                })

                
            socket.on('disconnect', async ()=>{
                console.log('desconectado')

                await usuarioDesconectado(uid);
            })
        })
    }
}

module.exports = Sockets;