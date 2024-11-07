const express = require("express");
const users = express.Router();
const UserModel = require("../models/Usersmodel");
const manageErrorMessage = require("../utilities/catchErrorsMessages");
const verifyToken = require("../middleware/verifyToken");

// GET tutti gli utenti
users.get("/users", verifyToken, async (req, res) => {
    try {
        const users = await UserModel.find();
        
        if (users.length === 0) {
            return res.status(404).send({
                statusCode: 404,
                message: "No users found"
            });
        }

        res.status(200).send({
            statusCode: 200,
            users
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: manageErrorMessage(error)
        });
    }
});

// GET utente per ID
users.get("/users/:userId", async (req, res) => {
    const { userId } = req.params;
    
    try {
        const user = await UserModel.findById(userId);
        
        if (!user) {
            return res.status(404).send({
                statusCode: 404,
                message: "User not found"
            });
        }

        res.status(200).send({
            statusCode: 200,
            user
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: manageErrorMessage(error)
        });
    }
});

// GET utente per email
users.get('/users/byemail/:email', async(req, res) => {
    const { email } = req.params;

    try {
        const user = await UserModel.findOne({ email });
        
        if (!user) {
            return res.status(404).send({
                statusCode: 404,
                message: "User not found"
            });
        }

        res.status(200).send({
            statusCode: 200,
            user
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: manageErrorMessage(error)
        });
    }
});

// POST crea nuovo utente
users.post("/users/create", async (req, res) => {
    try {
        const newUser = new UserModel(req.body);
        const user = await newUser.save();
        
        res.status(201).send({
            statusCode: 201,
            message: "User created successfully",
            user
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: manageErrorMessage(error)
        });
    }
});

// DELETE elimina utente
users.delete('/users/delete/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try {
        const user = await UserModel.findByIdAndDelete(userId);
        
        if (!user) {
            return res.status(404).send({
                statusCode: 404,
                message: "User not found"
            });
        }

        res.status(200).send({
            statusCode: 200,
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: manageErrorMessage(error)
        });
    }
});

module.exports = users;