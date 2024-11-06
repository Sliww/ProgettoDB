const express = require('express')
const comments = express.Router()
const Commentsmodel = require('../models/Commentsmodel')
const Bookmodel = require('../models/Bookmodel')
const Usersmodel = require('../models/Usersmodel')
const manageErrorMessage = require('../utilities/catchErrorsMessages')



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
            user: user.id,
            book: book.id
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

comments.delete('/comments/delete/:commentId', async (req, res)=>{
    const { commentId } = req.params
    try {
        const comment = await Commentsmodel.findByIdAndDelete(commentId)
        if(!comment) {
            res
                .status(404)
                .send({
                    statusCode: 404,
                    message: "No comment found"
                })
        }
        res 
            .status(200)
            .send({
                statusCode:200,
                message: "Deleted successfully"
            })
    } catch (error) {
        res
            .status(500)
            .send({
                statusCode:500,
                message: manageErrorMessage(error)
            })
    }
})

comments.put('/comments/update/:commentId', async (req, res, next) => {
    const { commentId } = req.params;
    const { rate, comment } = req.body;

    try {
        const updatedComment = await Commentsmodel.findByIdAndUpdate(
            commentId,
            { rate, comment },
            { new: true, runValidators: true }
        );

        if (!updatedComment) {
            return res
                .status(404)
                .send({
                    statusCode: 404,
                    message: "Commento non trovato"
                });
        }

        res
            .status(200)
            .send({
                statusCode: 200,
                message: "Commento aggiornato con successo",
                updatedComment
            });
    } catch (error) {
        res
            .status(500)
            .send({
                statusCode: 500,
                message: manageErrorMessage(error)
            });
    }
});


module.exports = comments; 