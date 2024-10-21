const express = require('express');
const login = express.Router();
const Usersmodel = require('../models/Usersmodel');

const isPassValid = (userPass, reqPass) => {
    if (userPass !== reqPass) {
        return false
    } else {
        return true
    }
};

login.post('/login', async (req, res) => {
    try {
        const user = await Usersmodel.findOne({ email: req.body.email })
        if (!user) {
            return res
                .status(404)
                .send({
                    statusCode: 404,
                    message: "Utente non trovato con l'email fornita"
                })
        }
        const checkPass = isPassValid(user.password, req.body.password);

        if (!checkPass) {
            res
                .status(403)
                .send({
                    statusCode: 403,
                    message: "Invalid password"
                })
        }
        res
            .status(200)
            .send({
                statusCode: 200,
                message: "Logged"
            })

    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Oops, something went wrong",
        });
    }
})

module.exports = login;
