// userRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;



const user = require("../models/userSchema");
const tokenGenerator = (email, secretKey) => {
  return jwt.sign({ email }, secretKey, { expiresIn: '1h' });
};

// router.get('/login/:email', async (req, res) => {
   
    
//     console.log("getalltasks", req.params.email)
//     try {
//         const userDetails = await user.findOne({email:req.params.email });
//         console.log(userDetails, "newuserdetails")
//         res.send(userDetails);
        
//     } catch (error) {
//         console.log("Error fetching tasks:", error);
//         res.status(500).json({ error: "Could not fetch tasks" });
//     }
// });

router.post("/login", async (req, res) => {
  try {
    const userCheck = await user.findOne({ email: req.body.email });
    console.log(req.body.password, req.body.email)
    console.log(userCheck, "user details")

    if (!userCheck || userCheck===null) {
      console.log("usernotfound")
      res.status(400).json({
        status: "Failed",
        message: "User Not Found, Kindly signup ",
      });
    } else {
      let passCheck = await bcrypt.compare(req.body.password, userCheck.password);
      if (passCheck) {
        console.log(passCheck, "checkthe password")

        let token = tokenGenerator(req.body.email, process.env.JWT_KEY); 
        console.log(token)

        const responseData = {
          status: "Successfully Login",
          token: token,
          email: userCheck.email,
          id: userCheck._id,
          name: userCheck.name,
        };

        res.status(200).json(responseData);
  
      } else {
        res.json({
          status: "Failed",
          message: "Enter valid Password",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Check your credentials",
    });
  }
});

router.post('/forgetPassword', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCheck = await user.findOne({ email });
    console.log(userCheck)

    if (!userCheck) {
      return res.status(400).json({
        status: 'Failed',
        message: 'User Not Found',
      });
    }

    // Generate a salt and hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
console.log(hashedPassword)
    // Update the user's password
    userCheck.password = hashedPassword;
    await userCheck.save();

    res.status(200).json({
      status: 'Success',
      message: 'Password updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: 'Check your credentials',
    });
  }
});


// Middleware function for handling POST request to /users
router.post('/signup', async(req, res) => {
    const details = req.body 

    console.log(details.details.name, "details of the task")


    const hashGenerate = async (plainpassword) => {
        try {
          const salt = await bcrypt.genSalt(saltRounds);
          const hash = await bcrypt.hash(plainpassword, salt);
          return hash;
        } catch (error) {
          return error;
        }
      };
    const hashPass = await hashGenerate(details.details.password);
    const userAlreadyExist = await user.findOne({ email: details.details.email });
    console.log(userAlreadyExist, "userAlreadyExists")
    const newUser = await user.create({
        name: details.details.name,
        email: details.details.email,
        password: hashPass,
      });
      console.log(newUser, "newuserDetails")
    res.send(newUser)
   
});

module.exports = router;

