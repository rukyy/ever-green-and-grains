const multer = require("multer")


const multerStorage = multer.diskStorage({
    destination: function(req, res, cb){
        cb(null,"./assets/files")
    },
    filename: function(req, file, cb){
        cb(null,file.originalname )
    }
})
const upload = multer({
    storage:multerStorage
})

module.exports = {upload}