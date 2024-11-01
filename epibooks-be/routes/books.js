const express = require('express')
const books = express.Router()
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')

const isEmptyArray = require('../utilities/checkArraysLength')
const manageErrorMessage = require('../utilities/catchErrorsMessages')
const validateBookBody = require('../middleware/validateBookBody')
const validateBookId = require('../middleware/validateBookIdParam')
const Bookmodel = require('../models/Bookmodel')
const { cloudStorage, internalStorage } = require('../middleware/multer/internal&cloudStorage');

const upload = multer({storage: internalStorage})
const cloud = multer({storage: cloudStorage})



books.get('/books', async (req, res) => {

    const { page = 1, pagesSize = 12 } = req.query;

    try {
        const books = await Bookmodel
            .find()
            .limit(pagesSize)
            .skip((page - 1) * pagesSize)

        const count = await Bookmodel.countDocuments()
        const totalPages = Math.ceil(count / pagesSize)


        if (isEmptyArray(books)) {
            return res
                .status(404)
                .send({
                    statusCode: 404,
                    message: "Books not Found"
                })
        }
        res
            .status(200)
            .send({
                statusCode: 200,
                message: `Books found ${books.length}`,
                count,
                totalPages,
                books
            })
    } catch (error) {
        res
            .status(500)
            .send({
                statusCode: 500,
                message: manageErrorMessage(error)
            })
    }
})

books.get('/books/byasin/:asin', async (req, res) => {

    const { asin } = req.params;

    try {
        const book = await Bookmodel.findOne({ asin })
        if (!book) {
            return res.status(404).send({
                statusCode: 404,
                message: "No book found"
            });
        }
        res.status(200).send({
            statusCode: 200,
            book
        });

    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: manageErrorMessage(error)
        });
    }
});

books.get('/books/byid/:id', async (req, res, next)=>{

    const { id } = req.params;

    try {
        const book = await Bookmodel.findById(id).populate("comments")
        if(!book){
            res
                .status(404)
                .send({
                    statusCode: 404,
                    message: "No book found"
                })
        }
        res 
            .status(200)
            .send({
                statusCode: 200,
                message: "Book found",
                book
            })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: manageErrorMessage(error)
        });
    }
})



books.post('/books/create', async (req, res)=>{
    console.log(req.body);

    const newBook = new Bookmodel({
        asin: req.body.asin,
        title: req.body.title,
        category: req.body.category,
        price: req.body.price,
        img: req.body.img
    });

    try {
        const book = await newBook.save();
        res
            .status(201)
            .send({
                statusCode: 201,
                message: "Book added successfully",
                book
            })
    } catch (error) {
        res
            .status(500)
            .send({
                statusCode: 500,
                message: manageErrorMessage(error)
            })
    }

})

books.delete('/books/delete/:booksId', async (req, res)=>{
    const { booksId} = req.params
    try {
        const book = await Bookmodel.findByIdAndDelete(booksId)
        if(!book) {
            res
                .status(404)
                .send({
                    statusCode: 404,
                    message: "No book found"
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

books.post('/books/upload', upload.single('img'), async (req, res, next)=>{
    try {
        const url = `${req.protocol}://${req.get('host')}` // http o http protocollo / :// è l'host
        const imgUrl = req.file.filename
        res 
            .status(200)
            .json({img: `${url}/uploads/${imgUrl}`})
    } catch (error) {
        next(error)
    }
})

books.post('/books/upload/cloud', cloud.single('img'), async (req, res, next)=>{
    try {
        res
            .status(200)
            .json({img: req.file.path})
    } catch (error) {
        next(error)
    }
})

books.patch('/books/updateModel', async(req, res, next)=>{
    await Bookmodel.updateMany({comments: {$exists: false}}, { $set: {comments: []}})
})


module.exports = books