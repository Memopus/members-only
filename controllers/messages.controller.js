const User = require("../models/users.model");
const Message = require("../models/messages.model");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.messages_list = asyncHandler(async(req , res ,next) => {
    const messages = await Message.find({})
    res.render('index.ejs' , {messages , user:undefined})
})

exports.message_create_get = asyncHandler(async (req , res ) => {
    if (req.user.isMember){
        res.render('messageForm.ejs')
    } else {
        res.redirect('/user/joinClub')
    }
})
exports.message_create_post = [
    body('title' , 'title length must be greater than 3')
    .trim()
    .isLength({ min: 3 })
    .escape(),
    body('content' , 'content length must be greater than 5')
    .trim()
    .isLength({ min:5 })
    .escape(),
    asyncHandler(async (req , res , next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            res.render('messageForm.ejs' , {errors : errors.array()}) 
        }
        const message = new Message({
            title:req.body.title,
            content:req.body.content,
            author:req.user._id,
        })
        await message.save()
        res.redirect('/')
            

})]