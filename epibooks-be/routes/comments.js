const express = require('express')
const comments = express.Router()
const Commentsmodel = require('../models/Commentsmodel')
const Bookmodel = require('../models/Bookmodel')
const Usersmodel = require('../models/Usersmodel')




comments.get('/comments', async(req, res, next)=>{

    try {
        const comments = await Commentsmodel
        .find()
        .populate("user book")

        res
            .status(200)
            .send({
                statusCode: "Comments found",
                comments
            })
    } catch (error) {
        
    }
})



comments.post('/comment/create', async (req, res, next)=> {

    const { rate, comment } = req.body;


    try {
        const user = await Usersmodel.findOne({_id: req.body.user})
        const book = await Bookmodel.findOne({_id: req.body.book})

        const newComment = new Commentsmodel({
            rate,
            comment,
            user: user._id,
            book: book._id
        })

        const savedComment = await newComment.save()
        await Bookmodel.updateOne(
            {_id: book._id}, 
            { $push: { comments: savedComment._id } }) 
        res
            .status(200)
            .send({
                statusCode: 200,
                message: "Comment created"
            })
    } catch (error) {
        next(error);
    }
})


module.exports = comments; 