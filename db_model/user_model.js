const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const validator = require("validator")

const schema = mongoose.Schema

const userSchema = new schema(
    {
        firstname: { type: String, require: true },
        lastname: { type: String, require: true },
        email: { type: String, require: true, unique: true },
        password: { type: String, require: true },
        phone: { type: Number, require: true },
        cart: { type: Array },
        address: { type: Object }

    }
)

// attaching a signup function to userDetails, e.g the type of findOne function used below
userSchema.statics.signup = async function (email, password, firstname, lastname, phone, cart) {
    // check email and passwords to be values
    if(!email || !password){
        throw Error("Please fill all forms")
    }
    // validate email(regex) and password strength
    if(!validator.isEmail(email)){
        throw Error("Email is invalid")
    }
    if(!validator.isStrongPassword(password)){
        throw Error("Password is not strong enough")
    }

    const exists = await this.findOne({ email })
    if (exists) {
        throw Error('User already exist')
    }
    // hash the password before saving it in database
    let salt = await bcrypt.genSalt(10)
    let hash = await bcrypt.hash(password, salt)

    // create user
    const user = this.create({ email, password:hash, phone, firstname, lastname, cart, address: {} })
    if (!user) {
        throw Error("user not created")
    }
    return user
}

userSchema.statics.signin = async function(email, password){
    if(!email || !password){
        throw new Error("please provide an email and password")
    }
    const user = await this.findOne({ email})
    if(!user){
        throw new Error("No account found with provided credentials.")
    }
    const validPass = await bcrypt.compare(password, user.password)
    if(!validPass){
        throw Error("Wrong password")
    }
    return user 
}

userSchema.statics.deleteUser = async function(email){
    const exists = this.findOne({email})
    if(!exists){
        throw Error("No account found with this email")
    }
    const deletedUser = await this.findOneAndDelete({email})
    if(!deletedUser){
        throw Error("user not deleted")
    }
    return deletedUser
}



module.exports = mongoose.model("userDetails", userSchema)