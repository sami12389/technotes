const User = require("../models/User")
const Note = require("../models/Note")
const asyncHandler = require("express-async-handler")
const bcryptjs = require("bcryptjs")


//GET all users
//Route GET/users
//Access private
const getAllUsers = asyncHandler(async(req, res)=>{
    const users = await User.find().select("-password").lean()
    if(!users?.length){
        return res.status(400).json({message: "No user found"})
    }
    res.json(users)
})


//Create new user
//Route POST/users
//Access private
const createNewUser = asyncHandler(async(req, res)=>{
    const {username, password, roles} = req.body
    //Confirm data
    if(!username || !password || !Array.isArray(roles) || !roles.length){
        return res.status(400).json({message: "All fields are required."})
    }
    //Check duplicates
    const duplicate = await User.findOne({username}).lean().exec()
    if(duplicate){
        return res.status(409).json({message: "Duplicate username"})
    }
    //Hash password
    const hashedPwd = await bcryptjs.hash(password, 10)
    const userObject = {username, "password": hashedPwd, roles}
    //Create new user
    const newUser = await User.create(userObject)
    if(newUser){
        res.status(200).json({message: `New user ${username} created.`})
    }else{
        res.status(400).json({message: "Invalid user data received"})
    }
})


//Create update user
//Route PATCH/users
//Access private
const updateUser = asyncHandler(async(req, res)=>{
    const {id, username, roles, active, password} = req.body
    //Confirm data
    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== "boolean"){
       return res.status(400).json({message: "All fields are required."})
    }
    //Find user
    const user = await User.findById(id).exec()
    if(!user){
        return res.status(400).json({message: "User not found"})
    }
    //Check duplicates
    const duplicate = await User.findOne({username}).lean().exec()
    //Allow updates
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message: "Duplicate username"})
    }

    user.username = username
    user.roles = roles
    user.active = active

    if(password){
        //Hash password
        user.password = await bcryptjs.hash(password, 10)
    }
    //Save user
    const updatedUser = await user.save()
    res.json({message: `${updatedUser.username} updated.`})
})


//Create delete user
//Route DELETE/users
//Access private
const deleteUser = asyncHandler(async(req, res)=>{
    const {id} = req.body
    //Verify Id
    if(!id){
        return res.status(400).json({message: "User Id Required"})
    }
    //Check for assigned notes
    const note = await Note.find({user: id}).lean().exec()
    if(note){
        return res.status(400).json({message: "User has assigned notes."})
    }
    //Find user
    const user = await User.findById(id).exec()
    if(!user){
        return res.status(400).json({message: "User not found"})
    }
    //Delete user
    const result = await user.deleteOne()
    const reply = `Username ${result.username} with ID ${result.id} deleted.`
    res.json(reply);
})


module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
}