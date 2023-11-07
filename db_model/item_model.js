const mongoose = require("mongoose")

const schema = mongoose.Schema

const itemScheme = new schema(
    {
        name: {type:String, required:true},
        description: {type:String, required:true},
        price: {type:Number, required:true},
        appxweight:{type:Number, require:true},
        images: {type:Array, required:true}
    },{timestamps:true}
)

module.exports= mongoose.model("itemDetails",itemScheme)