const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");
const ObjectId = mongoose.Types.ObjectId;

const productsSchema = mongoose.Schema({
    prodId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
        default: "noProductImage.png",
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories",
        required: true
    }
});


productsSchema.statics.uploadImage = (imageFile) =>{
    const allowedExt = ["jpg", "jpeg", "png", "JPEG"];
    let result = ''

    const imageName = imageFile.name;
    const imageExt = imageName.split(".").pop();
    
    const isValidExt = allowedExt.includes(imageExt);
    if(!isValidExt){
        return result = {error: "Invalid Image Format!"}
    } 

    const newImageName = new ObjectId().toHexString() + "." + imageExt;
    imageFile.mv(path.resolve(`./public/images/products/${newImageName}`), (error) => {
        if(error){
            return result =  {error: "something went wrong!"}
        }
    });
    return result = newImageName;
}

productsSchema.statics.prevImageRemove = async (imageName) =>{
    if(imageName === "noProductImage.png"){
        return {error: "No image to remove!"}
    }

    await fs.unlink(`./public/images/products/${imageName}`, (error) =>{
        if(error){
            return {error: "something went wrong!"}
        }
    });
    return {success: "old image removed!"};
}

const Product = mongoose.model("products", productsSchema);

module.exports = Product;