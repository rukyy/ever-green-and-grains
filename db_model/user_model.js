const mongoose = require("mongoose")

const schema = mongoose.Schema

const userSchema = new schema(
    {
        firstname:{type:String, require:true},
        lastname:{type:String, require:true},
        email:{type:String, require:true},
        phone:{type:Number, require:true},
        userID:{type:String, require:true},
        cart:{type:Array}
        
    }
)

module.exports = mongoose.model("userDetails",userSchema)