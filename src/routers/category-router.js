const express = require("express");
const Category = require("../models/category.js");
const Product = require("../models/products.js");

const auth = require("../middleware/auth.js");
const apiAuth = require("../middleware/apiAuth.js");

const router = new express.Router();

router.get("/category", auth, (req, res) =>{
    res.render("category", {title: "Product Categories", user: req.session.user})
});

//-------------------api endpoints---------------------------------------
router.post("/api/category", apiAuth, async (req, res) =>{
    try{
        const category = new Category(req.body);
        if(!category){
            return res.send({error: "category not created!"});
        }

        await category.save();
        res.send(category);
    }catch(error){
        res.send("something went wrong!");
    }
});

router.get("/api/category", apiAuth, async (req, res) =>{
    try{
        const categories = await Category.find({});
        res.send(categories);
    }catch(error){
        res.send({error: "something went wrong!"});
    }
});

router.get("/api/category/:id", apiAuth, async (req, res) =>{
    try{
        const category = await Category.findById({_id: req.params.id});
        if(!category){
            return res.send({error: "Category not found!"});
        }

        res.send(category);
    }catch(error){
        res.send({error: "something went wrong!"});
    }
});

router.patch("/api/category/:id", apiAuth, async (req, res) =>{
    try{
        const allowedFields = ["name"];
        const updatingFields = Object.keys(req.body);
        const validationCheck = updatingFields.every((field) =>{
            return allowedFields.includes(field);
        });

        if(!validationCheck){
            return res.send({error: "Invalid field update!"});
        }
        const category = await Category.findOneAndUpdate({_id: req.params.id}, req.body, {new: true});
        if(!category){
            return res.send({error: "category not updated!"});
        }

        await category.save();
        res.send(category);
    }catch(error){
        console.log(error);
        res.send({error: "something went wrong!"});
    }
});

router.delete("/api/category/:id", apiAuth, async (req, res) =>{
    try{
        const product = await Product.findOne({category: req.params.id});
        if(product){
            return res.send({error: "This category is used by a product!"});
        }

        const category = await Category.findOneAndDelete({_id: req.params.id});
        if(!category){
            return res.send({error: "category not removed!"});
        }

        res.send(category);
    }catch(error){
        res.send({error: "something went wrong!"});
    }
});

module.exports = router;