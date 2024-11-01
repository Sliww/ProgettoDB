const mongoose = require('mongoose');

const CommentsModel = new mongoose.Schema(
    {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
    },
    rate: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BooksModel"
    }
}, {
    timestamps: true,
    strict: true
})

module.exports = mongoose.model("CommentsModel", CommentsModel, "comments")