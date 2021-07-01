const multer = require ('multer');
const { v4 : uuidv4 } = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
    // destination: path.join(__dirname, '../public/img/uploads'),
    // filename: (req, file, cb, filename) => {
    //     console.log(file);
    //     cb(null, uuidv4() + path.extname(file.originalname));
    // }
    destination: function(req, file, cb){
        cb(null, 'public/storage/img')
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
})

const upload = multer({storage});

module.exports = upload;

