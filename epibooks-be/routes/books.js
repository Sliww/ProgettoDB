const express = require('express')
const books = express.Router()
const BooksModel = require('../models/Bookmodel')
const isEmptyArray = require('../utilities/checkArraysLength')
const manageErrorMessage = require('../utilities/catchErrorsMessages')


books.get('/books', async (req, res)=>{

    const { pages, pagesSize = 12 } = req.params;

    try {
        const books = await BooksModel
            .find()
            .limit(pagesSize)
            .skip((pages - 1) * pagesSize )
        
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