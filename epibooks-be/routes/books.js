const express = require('express')
const books = express.Router()
const multer = require('multer')
const { cloudStorage, internalStorage } = require('../middleware/multer/internal&cloudStorage')
const isEmptyArray = require('../utilities/checkArraysLength')
const manageErrorMessage = require('../utilities/catchErrorsMessages')
const Bookmodel = require('../models/Bookmodel')

const upload = multer({storage: internalStorage})
const cloud = multer({storage: cloudStorage})

// GET tutti i libri
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
            return res.status(404).send({
                statusCode: 404,
                message: "Books not Found"
            })
        }

        res.status(200).send({
            statusCode: 200,
            message: `Books found ${books.length}`,
            count,
            totalPages,
            books
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: manageErrorMessage(error)
        })
    }
})

// GET libro per ASIN
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

// GET libro per ID con commenti popolati 
books.get('/books/byid/:id', async (req, res) => {
    try {
        const book = await Bookmodel
            .findById(req.params.id)
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    model: 'userModel',
                    select: 'username name surname email'
                }
            })
            .lean()
            .exec();

        if (!book) {
            return res.status(404).send({
                statusCode: 404,
                message: "Book not found"
            });
        }

        res.status(200).send({
            statusCode: 200,
            message: "Book found successfully",
            book
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: manageErrorMessage(error)
        });
    }
});

// POST crea nuovo libro
books.post('/books/create', async (req, res) => {
    const newBook = new Bookmodel({
        asin: req.body.asin,
        title: req.body.title,
        category: req.body.category,
        price: req.body.price,
        img: req.body.img
    });

    try {
        const book = await newBook.save();
        res.status(201).send({
            statusCode: 201,
            message: "Book added successfully",
            book
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: manageErrorMessage(error)
        })
    }
})

// DELETE libro
books.delete('/books/delete/:booksId', async (req, res) => {
    const { booksId } = req.params
    try {
        const book = await Bookmodel.findByIdAndDelete(booksId)
        if (!book) {
            return res.status(404).send({
                statusCode: 404,
                message: "No book found"
            })
        }
        res.status(200).send({
            statusCode: 200,
            message: "Deleted successfully"
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: manageErrorMessage(error)
        })
    }
})

// POST upload immagine locale
books.post('/books/upload', upload.single('img'), async (req, res) => {
    try {
        const url = `${req.protocol}://${req.get('host')}`
        const imgUrl = req.file.filename
        res.status(200).json({ 
            img: `${url}/uploads/${imgUrl}` 
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: manageErrorMessage(error)
        })
    }
})

// POST upload immagine su cloud
books.post('/books/upload/cloud', cloud.single('img'), async (req, res) => {
    try {
        res.status(200).json({ 
            img: req.file.path 
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: manageErrorMessage(error)
        })
    }
})

module.exports = books