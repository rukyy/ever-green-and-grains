const express = require("express")
const router = express.Router()
const {upload} = require("../multer")
const {getItem, getItems, postItem} = require('../controllers/items')


router.get('/',getItems)
router.get('/:id',getItem)
router.post('/',upload.array("file"),postItem)


module.exports = router