const express = require('express')
const comments = express.Router()
const Commentsmodel = require('../models/Commentsmodel')
const Bookmodel = require('../models/Bookmodel')
const Usersmodel = require('../models/Usersmodel')
const manageErrorMessage = require('../utilities/catchErrorsMessages')

const populateConfig = {
    user: {
        path: 'user',
        model: 'userModel',
        select: 'username name surname email'
    },
    book: {
        path: 'book',
        model: 'BooksModel',
        select: 'title asin category img'
    }
};

// GET tutti i commenti
comments.get('/comments', async(req, res) => {
    try {
        const comments = await Commentsmodel
            .find()
            .populate(populateConfig.user)
            .populate(populateConfig.book)
            .lean()
            .exec();

        res.status(200).send({
            statusCode: 200,
            message: "Comments found",
            comments
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: manageErrorMessage(error)
        });
    }
});

// GET commenti per libro pagina dettaglii
comments.get('/comments/book/:bookId', async(req, res) => {
    try {
        const { bookId } = req.params;
        const comments = await Commentsmodel
            .find({ book: bookId })
            .populate(populateConfig.user)
            .populate(populateConfig.book)
            .lean()
            .exec();

        res.status(200).send({
            statusCode: 200,
            message: "Comments found",
            comments
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: manageErrorMessage(error)
        });
    }
});

// POST crea nuovo commento
comments.post('/comment/create', async (req, res) => {
    const { rate, comment, user: userId, book: bookId } = req.body;

    try {
        const [user, book] = await Promise.all([
            Usersmodel.findById(userId),
            Bookmodel.findById(bookId)
        ]);

        if (!user || !book) {
            return res.status(404).send({
                statusCode: 404,
                message: user ? "Book not found" : "User not found"
            });
        }

        const newComment = new Commentsmodel({
            rate,
            comment,
            user: user._id,
            book: book._id
        });

        const savedComment = await newComment.save();
        
        const populatedComment = await Commentsmodel
            .findById(savedComment._id)
            .populate(populateConfig.user)
            .populate(populateConfig.book)
            .lean()
            .exec();

        await Bookmodel.findByIdAndUpdate(
            book._id,
            { $push: { comments: savedComment._id } }
        );

        res.status(201).send({
            statusCode: 201,
            message: "Comment created successfully",
            comment: populatedComment
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: manageErrorMessage(error)
        });
    }
});

// PUT aggiorna commento
comments.put('/comments/update/:commentId', async (req, res) => {
    const { commentId } = req.params;
    const { rate, comment } = req.body;

    try {
        const updatedComment = await Commentsmodel
            .findByIdAndUpdate(
                commentId,
                { rate, comment },
                { new: true }
            )
            .populate(populateConfig.user)
            .populate(populateConfig.book);

        if (!updatedComment) {
            return res.status(404).send({
                statusCode: 404,
                message: "Comment not found"
            });
        }

        res.status(200).send({
            statusCode: 200,
            message: "Comment updated successfully",
            updatedComment
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: manageErrorMessage(error)
        });
    }
});

// DELETE elimina commento
comments.delete('/comments/delete/:commentId', async (req, res) => {
    const { commentId } = req.params;
    
    try {
        const comment = await Commentsmodel.findByIdAndDelete(commentId);
        
        if (!comment) {
            return res.status(404).send({
                statusCode: 404,
                message: "Comment not found"
            });
        }
        await Bookmodel.findByIdAndUpdate(
            comment.book,
            { $pull: { comments: commentId } }
        );

        res.status(200).send({
            statusCode: 200,
            message: "Comment deleted successfully"
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: manageErrorMessage(error)
        });
    }
});

module.exports = comments;