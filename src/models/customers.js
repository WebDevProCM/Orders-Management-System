const mongoose = require("mongoose");
const validator = require("validator");

const customerSchema = mongoose.Schema({
    cusId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate: (email) =>{
            if(!validator.isEmail(email)){
                throw new Error("Invalid email address!");
            }
        }
    },
    address: {
        type: String,
        required: true,
        trim: true
    }
});

const Customer =  mongoose.model("Customers", customerSchema);

module.exports = Customer;