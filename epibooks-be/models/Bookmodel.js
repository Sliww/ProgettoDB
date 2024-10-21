const mongoose = require('mongoose')

const ALLOWED_CATEGORIES = ["horror", "scifi", "fantasy", "romance", "history"]

const BookSchema = new mongoose.Schema({
    asin: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ALLOWED_CATEGORIES,
        required: true
    },
    price: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    img: {
        type: String,
        required: false,
        default: "https://placehold.co/600x400"
    }
}, { timestamps: true, strict: true })

module.exports = mongoose.model("BooksModel", BookSchema, "books")