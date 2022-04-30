const User = require("../modals/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

router.post("/register", async(req,res)=>{
    
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        
        const newUser = new User({
            username: req.body.username,
            email:  req.body.email,
            password:hashedPassword,
        })
        
        const saveUser = await newUser.save();
        res.status(201).json(saveUser)
    } catch (error) {
        res.status(400).json(error)
    }
})

//Login Route
router.post("/login", async(req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        !user && res.status(404).json("user not found")

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("wrong Credentials")
       
        res.status(200).json(user)
    } catch (error) {
        
    }
})



module.exports = router;