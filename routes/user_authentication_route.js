const express = require("express")

const router = express.Router()

const {createUser, LoginUser, logOut, authStatus,getUserDetails} = require("../controllers/user_authentication")


router.post("/", createUser)
router.post("/signin",LoginUser)
router.get("/", logOut)
router.get("/", authStatus)
router.get("/:email", getUserDetails)

module.exports = router

