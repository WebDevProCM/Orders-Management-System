const express = require("express");
const Customer = require("../models/customers.js")

const auth = require("../middleware/auth.js");
const apiAuth = require("../middleware/apiAuth.js");
const idGenerator = require("../utilis/idGenerator.js");

const router = new express.Router();

router.get("/customer", auth, (req, res) =>{
    res.render("customers.hbs", {title: "Customers", user: req.session.user});
});

//-------------------api endpoints---------------------------------------
router.post("/api/customer", apiAuth, async (req, res) =>{
    req.body.cusId = idGenerator.cusIdGenerator();
    try{
        const customer = new Customer(req.body);
        if(!customer){
            return res.send({error: "customer not created!"});
        }

        await customer.save();
        res.send(customer);
    }catch(error){
        if(error.message.includes("Invalid email")){
            return res.send({error: "Invalid email address"});
        }
        res.send({error:"something went wrong!"});
    }
});

router.get("/api/customer", apiAuth, async (req, res) =>{
    try{
        const customers = await Customer.find({});
        res.send(customers);
    }catch(error){
        res.send({error: "something went wrong!"});
    }
});

router.get("/api/customer/:id", apiAuth, async (req, res) =>{
    try{
        const customer = await Customer.findOne({cusId: req.params.id});
        if(!customer){
            return res.send({error: "customer not found!"});
        }

        res.send(customer);
    }catch(error){
        res.send({error: "something went wrong!"});
    }
});

router.patch("/api/customer/:id", apiAuth, async (req, res) =>{
    try{
        const allowedFields = ["name", "address"];
        const updatingFields = Object.keys(req.body);
        const validationCheck = updatingFields.every((field) =>{
            return allowedFields.includes(field);
        });

        if(!validationCheck){
            return res.send({error: "Invalid field update!"});
        }
        const customer = await Customer.findOneAndUpdate({cusId: req.params.id}, req.body, {new: true});
        if(!customer){
            res.send({error: "customer not updated!"});
        }

        await customer.save();
        res.send(customer);
    }catch(error){
        res.send({error: "something went wrong!"});
    }
});

router.delete("/api/customer/:id", apiAuth, async (req, res) =>{
    try{
        const customer = await Customer.findOneAndDelete({cusId: req.params.id});
        if(!customer){
            return res.send({error: "Customer not removed!"});
        }

        res.send(customer);
    }catch(error){
        res.send({error: "something went wrong!"});
    }
});

module.exports = router;