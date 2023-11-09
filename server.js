require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const itemRoutes = require("./routes/item-routes")
const bodyParser = require("body-parser")


const app = express()

app.use(bodyParser.urlencoded({extended:true}))


app.use(cors())
app.use(express.json()) // for parsing application/json


app.use((req, res, next) => {
    next()
})

app.use("/item",itemRoutes)

mongoose.connect(process.env.URI)
.then(()=>{
    app.listen(1000, console.log("listening on port 1000"))
}).catch((error)=>{
    console.log(`Error: ${error}`)
})
