const express = require("express");
const users = express.Router();
const UserModel = require("../models/Usersmodel");
const bcrypt = require("bcrypt");
const manageErrorMessage = require("../utilities/catchErrorsMessages");
const verifyToken = require("../middleware/verifyToken");


users.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await UserModel.find();
    if (users.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "User not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      users,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Oops, something went wrong",
    });
  }
});

users.get("/users/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res
          .status(404)
          .send({
            statusCode: 404,
            message: "No user found"
          })
      }
      res 
        .status(200)
        .send({
          statusCode: 200,
          user
        })
    } catch (error) {
        res
          .status(500)
          .send({
            statusCode: 500,
            message: "Ops something went wrong"
          })
    }
});

users.get('/users/byemail/:email', async(req, res)=> {
  const { email } = req.params

  try {
    const user = await UserModel.find({
      email: email
    })
    if(!user){
      res
        .status(404)
        .send({
          statusCode: 404,
          message: "No user found"
        })
    }
    res 
      .status(200)
      .send({
        statusCode: 200,
        user
      })
  } catch (error) {
    res
      .status(500)
      .send({
        statusCode: 500,
        message: "Ops something went wrong"
      })
  }
})



users.post("/users/create", async (req, res) => {
  console.log(req.body);
const newUser = new UserModel(req.body);

  try {
    const user = await newUser.save();
    res.status(201).send({
      statusCode: 201,
      message: "User saved successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: manageErrorMessage(error),
    });
  }
});

users.delete('/users/delete/:userId', async (req, res)=>{
const { userId } = req.params
try {
  const user = await UserModel.findByIdAndDelete(userId)
  if(!user){
    res
        .status(404)
        .send({
          statusCode: 404,
          message: "No user found"
        })
  }
  res 
    .status(200)
    .send({
      statusCode: 200,
      message: "Deleted successfully"
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


module.exports = users;