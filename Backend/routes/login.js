const express = require('express');
const router = express.Router();
const Leave = require('../models/LeaveJ.js');
const Student = require('../models/StudentsJ.js');

router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    try {
        console.log(`Searching for user with email: ${email}`);
        User = await Student.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
        if(!User){
            return res.status(404).json({message:"User not found"})
        }
        if(User.password!==password){
            return res.status(400).json({message:"invalid password"})
        }
        return res.status(200).json({message:"Successfully",data:User});
        
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({message:error.message});
    }

});
router.post('/google-login',async(req,res)=>{
    const {email}=req.body;
    console.log(email);
    try {
        User=await Student.findOne({email:{ $regex: new RegExp(email, "i") }});
        if(!User){
            return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json({message:"Successfully",data:User});
        
    } catch (error) {
        return res.status(500).json({message:error.message});
    }

});

module.exports = router;