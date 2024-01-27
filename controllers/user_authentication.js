require("dotenv").config()
const { initializeApp } = require('firebase/app');
const { getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  reauthenticateWithCredential,
  deleteUser
} = require("firebase/auth")
const jwt = require("jsonwebtoken")
const userDetails = require("../db_model/user_model");
const { json } = require("body-parser");



// firebase config 
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// initialising firebase app
const firebaseapp = initializeApp(firebaseConfig)

// initialize firebase authentication 
const auth = getAuth(firebaseapp)


const genToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET)
}

const signUp = async (req, res) => {
  const { firstname, lastname, email, phone, password, cart } = req.body
  try {
    const userDet = await userDetails.signup(email, password, firstname, lastname, phone, cart)
    const token = genToken(userDet._id)
    return res.status(200).json({ email, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// get authentication status from firebase
const authStatus = async (req, res) => {
  try {
    onAuthStateChanged(auth, (user) => {
      console.log("user auth state change", user)
      return res.status(200).json(user)
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ 'mssg': error })
  }

}

// Logout function
const logOut = async (req, res) => {
  try {
    return res.status(200).json({ "mssg": "done" })
  } catch (err) {
    console.log(err)
    return res.status(400).json({ "message": err })
  }
}



// this function is to login in the user with firebase 
const signIn = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    let cart = req.body.cart

    if (!email || !password) {
      return res.status(400).json({ mssg: "please fill all fields" })
    } else {
      const newarr = []
      const credentials = await userDetails.signin(email, password)
      if (!credentials) {
        return res.status(400).json()
      }
      const detail = {
        firstname: credentials["firstname"],
        lastname: credentials["lastname"],
        email :credentials["email"]
      }
      const token = genToken(credentials._id)
      // cart items attached to user
      const cartItems = credentials["cart"]
      // spread out the users cart and the saved cart in L_storage to check nd remove duplicates
      if (cart && cartItems) {
        [...cart, ...cartItems].filter((item) => {
          const isDuplicate = newarr.some(obj => {
            if (obj.itemID === item.itemID) {
              return obj.itemID === item.itemID
            }
          })
          if (!isDuplicate) {
            newarr.push(item)
          }
        })
      }
      return res.status(200).json({ detail, newarr, token })
    }

  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

const getUserDetails =async (req, res)=>{
  const email = req.params
  console.log(email.email)
  const user = await userDetails.findOne({"email":email.email})
  if(!user){
    return res.status(401).json({message:"No User Found!"});
  }
  return res.status(200).json({  firstname: user.firstname,
  lastname: user.lastname,
  email: user.email,   
  phone: user.phone,
  address: user.address
})
}

const updateAddress = async (req, res) => {
  const { land, address, email } = req.body;
  console.log(land, address)
  const info = await userDetails.updateOne({ "email": email }, { $set: { "address": { land, address } } })
  if (!info) {
    return res.status(400).json({ "error": "sorry could not update" })
  }
  console.log(info)
  return res.status(200).json(info)
}

// delete user from firebase and mongodb 
const delUser = async (req, res) => {
  try{
    const { email } = req.body
    console.log("DELETE: ", email )
    const confirmation = userDetails.deleteUser(email)
    res.status(200).json({confirmation:"success"})
  }catch(error){
    return res.status(500).json(error)
  }
  //get the userdet from mongodb
}

module.exports = {
  signUp,
  signIn,
  logOut,
  authStatus,
  getUserDetails,
  updateAddress,
  delUser
}


