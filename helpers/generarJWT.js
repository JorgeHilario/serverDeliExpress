const jwt = require('jsonwebtoken');

const generarJWT = (uid, tipo) => {

    return new Promise ((resolve, reject)=>{

        const payload = { uid, tipo };

        console.log(payload)

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '365d'
        }, (err, token) =>{
            if(err){
                console.log(err)
                reject('No se pudo generar el token')
            }else{
                resolve(token);
            }
        })
    })
}

const comprobarJWT = ( token = '' ) => {
    try {
        
        const {uid, tipo} = jwt.verify( token, process.env.SECRETORPRIVATEKEY)

        return [true, uid, tipo]

    } catch (error) {
        console.log(error)
        return [false, null, null]
    }
}

module.exports = {
    generarJWT,
    comprobarJWT
}