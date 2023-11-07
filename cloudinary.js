const cloudinary = require("cloudinary").v2
require("dotenv").config()



cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const uppload = async (filepath) => {
    const options = {
        folder: "foodoo",
        use_filename: true,
        resource_type: "image",
        overwrite: true
    }

    return await cloudinary.uploader.upload(filepath, options)
        .then((results) => {
            return results
        }).catch((error) => {
            return error
        })
}


module.exports = { uppload }