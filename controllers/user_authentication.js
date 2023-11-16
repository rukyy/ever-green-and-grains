const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth")
const userDetails = require("../db_model/user_model");


// firebase config 
const firebaseConfig = {
  apiKey: "AIzaSyAGeJs2HECXhB6VH92l6KAI9p5xAUAlRRc",
  authDomain: "ever-green-and-grains.firebaseapp.com",
  projectId: "ever-green-and-grains",
  storageBucket: "ever-green-and-grains.appspot.com",
  messagingSenderId: "510748676370",
  appId: "1:510748676370:web:0983af0e68d84b8950a3cb",
  measurementId: "G-YYFRNL5KY0"
};

// initialising firebase app
const firebaseapp = initializeApp(firebaseConfig)

// initialize firebase authentication 
const auth = getAuth(firebaseapp)

const syncCart =()=>{
  // fetching cart items from localStorage and converting them into array of objects
  let cartItems = JSON.parse(localStorage.getItem("cart")) 
  if(!cartItems){
    return []
  }
  console.log(cartItems)
  return cartItems
}

const createUser = async (req, res) => {
  const { firstname, lastname, email,phone, password,cart } = req.body
  console.log(req.body)
  await createUserWithEmailAndPassword(auth, email, password)
  .then(async (result)=>{
    const details ={firstname, lastname, email, phone,userID:result["user"]["uid"],cart}
    const post = await userDetails.create(details)
    if(!post){
      return res.status(404).json({"error":"please try again"})
    }
    return res.status(200).json(post)
  }).catch((e)=>{
    console.log(e)
    return res.status(404).json(e)
  })

  
  // const user = await createUserWithEmailAndPassword(auth, email, password)
  // console.log(user["code"]);
  // if (!user) {
  //   return res.status(404).json({ "error": "unable to create user" })
  // }
  // console.log(user["user"]['email'])
  // return res.status(200).json(user)
}



module.exports = { createUser }