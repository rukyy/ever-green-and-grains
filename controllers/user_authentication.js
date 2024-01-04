require("dotenv").config()
const { initializeApp } = require('firebase/app');
const { getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} = require("firebase/auth")
const userDetails = require("../db_model/user_model");



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


// get authentication status from firebase
const authStatus = async (req, res) => {
  try {
    onAuthStateChanged(auth, (user) => {
      console.log("user auth state change", user)
      return res.status(200).json(user)
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({'mssg':error})
  }

}

// Logout function
const logOut = async (req, res) => {
  try {
    await signOut(auth);
    return res.status(200).json({ "mssg": "done" })
  } catch (err) {
    console.log(err)
    return res.status(400).json({ "message": err })
  }
}

// get user info from mongodb using users email
const getUserItems =async (email)=>{
  const userRef =await userDetails.find({"email":email});
  if(!userRef){
    return {"error":"Not Found"}
  }

  return userRef[0]
}

// this function is to login in the user with firebase 
const LoginUser = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    let cart = req.body.cart 


    if (!email || !password) {
      return res.status(400).send({ message: "Please provide all the details." });
    } else {
      const newarr = []
      // get credentials from firebsae auth
      await signInWithEmailAndPassword(auth, email, password)
        .then(async (credential) => {
          const mongoUsercred =await getUserItems(email)
          const cartItems = mongoUsercred["cart"]
          // spread out the users cart and the saved cart on the browser to check and remove duplicates
          if(cart && cartItems){
            [...cart, ...cartItems].filter((item)=>{
              const isDuplicate = newarr.some(obj => {
                if(obj.itemID === item.itemID){
                  return obj.itemID === item.itemID
                }
              })
              if(!isDuplicate){
                newarr.push(item)
              }
            })
          }
          
          return res.status(200).json({ ...credential, newarr,firstname:mongoUsercred["firstname"],lastname:mongoUsercred["lastname"], phone:mongoUsercred["phone"] })
        })
        .catch((error) => {
          console.log(error["code"]);
          return res.status(400).send({ message: error["code"] })
        });
    };
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}


// get userdetails from mongodb(as a route) and return as a response
const getUserDetails =async (req, res) =>{
  const {email} = req.params
  const info = await getUserItems(email)
  if(!info){
    return res.status(404).json({message:"No user found with this email"})
  }
  return res.status(200).json(info)
}

const createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password, cart } = req.body
    if (!email || !password) {
      return res.status(400).send({ message: "please enter a valid email and password" })
    }
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (result) => {
        const details = { firstname, lastname, email, phone, userID: result["user"]["uid"], cart }
        const post = await userDetails.create(details)
        if (!post) {
          return res.status(404).json({ "error": "please try again" })
        }
        return res.status(200).json(post)
      }).catch((e) => {
        console.log(e)
        return res.status(404).json(e)
      })

  } catch (e) {
    res.status(500).json({ error: e.toString() })
  }


}



module.exports = {
  createUser,
  LoginUser,
  logOut,
  authStatus,
  getUserDetails
}


