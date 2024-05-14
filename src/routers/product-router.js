const express = require("express");
const Product = require("../models/products.js");
const Category = require("../models/category.js");

const auth = require("../middleware/auth.js");
const apiAuth = require("../middleware/apiAuth.js");
const idGenerator = require("../utilis/idGenerator.js");

const router = new express.Router();

router.get("/products", auth, (req, res) =>{
    res.render("products", {title: "Products", user: req.session.user})
});

//-------------------api endpoints---------------------------------------
router.post("/api/product", apiAuth, async (req, res) =>{
    req.body.prodId = idGenerator.prodIdGenerator();
    try{
        if(req.files){
            const imageName = await Product.uploadImage(req.files.image);
            if(imageName.error){
                return res.send({error: imageName.error});
            }

            req.body.image = imageName;
        }
        const category = await Category.findById(req.body.category);
        if(!category){
            return res.send({error: "Category not found!"});
        }

        const product = new Product(req.body);
        if(!product){
            return res.send({error: "product not created!"});
        }

        await product.save();
        await product.populate("category");
        res.send(product);
    }catch(error){
        res.send({error:"something went wrong!"});
    }
});

router.get("/api/product", apiAuth, async (req, res) =>{
    try{
        const products = await Product.find({}).populate("category");
        res.send(products);
    }catch(error){
        res.send({error: "something went wrong!"});
    }
});

router.get("/api/product/:id", apiAuth, async (req, res) =>{
    try{
        const product = await Product.findOne({prodId: req.params.id});
        if(!product){
            return res.send({error: "product not found!"});
        }
        await product.populate("category");
        res.send(product);
    }catch(error){
        res.send({error: "something went wrong!"});
    }
});

router.patch("/api/product/:id", apiAuth, async (req, res) =>{
    try{
        const allowedFields = ["name", "quantity", "price", "status", "image", "category"];
        if(req.files){
            const imageName = await Product.uploadImage(req.files.image);
            if(imageName.error){
                return res.send({error: imageName.error});
            }

            req.body.image = imageName;
        }

        const updatingFields = Object.keys(req.body);
        const validationCheck = updatingFields.every((field) =>{
            return allowedFields.includes(field);
        });

        if(!validationCheck){
            return res.send({error: "Invalid field update!"});
        }
        const category = await Category.findById(req.body.category);
        if(!category){
            return res.send({error: "Category not found!"});
        }

        const product = await Product.findOne({prodId: req.params.id});
        if(!product){
            res.send({error: "product not updated!"});
        }
        const oldImageName = product.image;
        updatingFields.forEach((field)=>{
            product[field] = req.body[field];
        });

        if(oldImageName !== product.image){
            const result =  await Product.prevImageRemove(oldImageName);
        }

        await product.save();
        await product.populate("category");
        res.send(product);
    }catch(error){
        res.send({error: "something went wrong!"});
    }
});

router.delete("/api/product/:id", apiAuth, async (req, res) =>{
    try{
        const product = await Product.findOneAndDelete({prodId: req.params.id});
        if(!product){
            return res.send({error: "product not found!"});
        }
        await product.populate("category");
        res.send(product);
    }catch(error){
        res.send({error: "something went wrong!"});
    }
});

module.exports = router;