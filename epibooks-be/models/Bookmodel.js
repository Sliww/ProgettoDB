const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
    asin: {
        type: String,
        required: true,
        unique: true,
        minLength: 10,
        validate: {
            validator: function (v) {
                return /^[0-9]+$/.test(v);
            },
            message: props => `${props.value} non è un ASIN valido!`
        }
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
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