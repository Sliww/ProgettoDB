const express = require('express');
const login = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usersmodel = require('../models/Usersmodel');

const isPassValid = (userPass, reqPass) => {
    if (userPass !== reqPass) {
        return false
    } else {
        return true
    }
};

login.post('/login', async (req, res, next) => {
    try {
        const user = await Usersmodel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).send({
                statusCode: 404,
                message: "User not found with the provided email or password"
            });
        }
        
        const checkPass = await bcrypt.compare(req.body.password, user.password);
        if (!checkPass) {
            return res.status(401).send({
                statusCode: 401,
                message: "Invalid password or email"
            });
        }

        const token = jwt.sign({ 
            email: user.email,
            userId: user._id,
            isActive: user.isActive,
            dob: user.dob,
            createdAt: user.createdAt
        }, process.env.JWT_SECRET, {expiresIn: "15m"});

        return res
            .header("Authorization", token)
            .status(200)
            .send({
                statusCode: 200,
                message: "Logged in successfully",
                token
            });

    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            message: "Oops, something went wrong",
            error: error.message
        });
    }
});

module.exports = login;
