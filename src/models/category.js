const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
})

const Category = mongoose.model("Categories", categorySchema);

module.exports = Category;