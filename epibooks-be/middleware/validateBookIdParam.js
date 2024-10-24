const { param, validationResult } = require('express-validator')

//FARE LE CRUD E FINIRE LA VALIDAZIONE DELLA GET DEL LIBRO PER ID DEL LIBRO!

const validateBookId = [
 param('bookId')
    .isString()
    .isMongoId()
    .notEmpty()
    .withMessage("Book id must me a valid object id"),

(req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: "Validation failed!",
                errors: errors.array()
            })
    }
    next()
}
]