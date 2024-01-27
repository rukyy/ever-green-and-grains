const express = require("express")

const router = express.Router()

const {signUp, signIn, logOut ,getUserDetails, updateAddress, delUser} = require("../controllers/user_authentication")

// signup user
router.post("/signup", signUp)
// signin user
router.post("/signin",signIn)
// logout user
router.get("/", logOut)

// router.get("/status", authStatus)
// get user details
router.get("/:email", getUserDetails)
// update user details
router.post("/update", updateAddress)
// delete user
router.delete("/delete", delUser)

module.exports = router

