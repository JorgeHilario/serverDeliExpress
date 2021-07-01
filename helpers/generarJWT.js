const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {

    return new Promise ((resolve, reject)=>{

        const payload = { uid };

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
        
        const {uid} = jwt.verify( token, process.env.SECRETORPRIVATEKEY)

        return [true, uid]

    } catch (error) {
        console.log(error)
        return [false, null]
    }
}

module.exports = {
    generarJWT,
    comprobarJWT
}