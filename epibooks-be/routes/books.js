const express = require('express')
const books = express.Router()
const BooksModel = require('../models/Bookmodel')
const isEmptyArray = require('../utilities/checkArraysLength')
const manageErrorMessage = require('../utilities/catchErrorsMessages')
const validateBookBody = require('../middleware/validateBookBody')
const validateBookId = require('../middleware/validateBookIdParam')
//FARE LE CRUD PER I BOOKS! E INSERIRE NELLA POST IL MIDDLEWARE VALIDATEBOOKBODY! 

books.get('/books', async (req, res)=>{

    const { page = 1, pagesSize = 12 } = req.query;

    try {
        const books = await BooksModel
            .find()
            .limit(pagesSize)
            .skip((page - 1) * pagesSize )

            const count = await BooksModel.countDocuments()
            const totalPages = Math.ceil(count / pagesSize)

        
        if(isEmptyArray(books)){
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



module.exports = books