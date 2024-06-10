const mongoose = require("mongoose"); 

const userSchema =new mongoose.Schema({
    name : {
        type : String,
       
    },
   
    email : {
        type : String,
       
    },
    password:{
        type:String,
       
    },
   
})

const users = mongoose.model("Users", userSchema);
module.exports = users;