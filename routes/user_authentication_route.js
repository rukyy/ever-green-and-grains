const express = require("express")

const router = express.Router()

const {createUser} = require("../controllers/user_authentication")


router.post("/", createUser)

module.exports = router

