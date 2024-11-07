const express = require('express');
const login = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usersmodel = require('../models/Usersmodel');

login.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Usersmodel.findOne({ email });
        if (!user) {
            return res.status(401).send({
                statusCode: 401,
                message: "Invalid credentials"
            });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({
                statusCode: 401,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign({ 
            email: user.email,
            userId: user._id,
            name: user.name,
            surname: user.surname,
            isActive: user.isActive,
            dob: user.dob,
            createdAt: user.createdAt
        }, process.env.JWT_SECRET, {
            expiresIn: "15m"
        });

        res.header("Authorization", token)
           .status(200)
           .send({
                statusCode: 200,
                message: "Logged in successfully",
                token
           });

    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error: error.message
        });
    }
});

module.exports = login;
