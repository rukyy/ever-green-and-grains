const mongoose = require("mongoose")
const { uppload } = require("../cloudinary")

const itemDetails = require("../db_model/item_model")

const getItem = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ "error": "enter a correct id format " })
    }
    const oneItem = await itemDetails.findById(id)
    if (!oneItem) {
        return res.status(404).json({ "error": "item not found" })
    }
    res.status(200).json(oneItem)
}

const getItems = async (req, res) => {
    let items = await itemDetails.find({}).sort({ createdAt: -1 })
    if (!items) {
        res.status(404).json({ "error": "Items not found" })
    }
    res.status(200).json(items)
}

const getUserItems = async (req, res) =>{
    try{
        const userID=req.user._id   
        console.log('user',userID);
        const userItems = await itemDetails.find({ owner: userID }).sort({ createdAt: -1 });
        if(userItems){
            res.status(200).send(userItems)
        }
    }
        catch{
            throw new Error ('Error in getting the data')
        }

}


const postItem = async (req, res) => {
    const secureUrls = []
    for (i = 0; i < req.files.length; i++) {
        await uppload(req.files[i]["destination"] + '/' + req.files[i]["filename"])
            .then((results) => {
                if (!results) {
                    return res.status(404).json({ "mssg": "error occured" })
                }
                else {
                    secureUrls.push(results.secure_url);
                }
            }).catch((error) => {
                console.log(error)
                return res.status(404).json(error)
            })
    }

    const newItem = {
        name: req.body.file[0],
        description: req.body.file[1],
        price: Number(req.body.file[2]),
        appxweight: Number(req.body.file[3]),
        images: secureUrls
    }
    const post = await itemDetails.create(newItem)
    if (!post) {
        res.status(404).json({ "error": "error occured, Post failed" })
    }
    res.status(200).json(post)  
}

module.exports = {
    getItem,
    getItems,
    postItem
}