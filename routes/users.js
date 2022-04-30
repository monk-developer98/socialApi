const router = require("express").Router();
const bcrypt = require("bcrypt");
const { json } = require("express/lib/response");
const User = require("../modals/User");

//update user
router.put("/:id", async(req,res)=>{
   
        if(req.body.userId === req.params.id || req.user.isAdmin){
            if(req.body.password){
                try {
                    const salt = await bcrypt.genSalt(10);
                    req.body.password = await bcrypt.hash(req.body.password, salt)
                } catch (error) {
                    res.status(500).json(error)
                }
            }
            try {
                const user = await User.findByIdAndUpdate(req.params.id, {
                    $set: req.body,
                });
                res.status(200).json("Account has been updated")
            } catch (error) {
                res.status(500).json(error)
            }
        }else{
            res.status(403).json("you can only update only your account!");
        }
})

//delete User 
router.delete("/:id", async(req,res)=>{
   
        if(req.body.userId === req.params.id || req.user.isAdmin){
            try {
                const user = await User.findByIdAndDelete(req.params.id)
                res.status(200).json("Account has been deleted")
            } catch (error) {
                res.status(500).json(error)
            }
        }else{
            res.status(403).json("you can only delete only your account!");
        }
})

//get a user
router.get("/:id", async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        const {password, updatedAt , ...others} = user._doc
        res.status(200).json(others)
    } catch (error) {
        res.status(500).json(error)
    }
})

//follow a user 
router.put("/:id/follow", async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)) {
                await user.updateOne({$push:{ followers:req.body.userId}});
                await currentUser.updateOne({$push:{ following:req.body.id}});
                res.status(200).json("user has been followed")
            }else{
                res.status(403).json("you Already follow this user")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("you cant follow youre self")
    }
})

//unfollow user
router.put("/:id/unfollow", async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)) {
                await user.updateOne({$pull:{ followers:req.body.userId}});
                await currentUser.updateOne({$pull:{ following:req.body.id}});
                res.status(200).json("user has been unfollowed")
            }else{
                res.status(403).json("you dont unfollow this user")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("you cant unfollow youre self")
    }
})
module.exports = router;