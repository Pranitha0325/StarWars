const mongoose = require("mongoose"); 

const blogsSchema =new mongoose.Schema({
    title : {
        type : String, 
    },
    description : {
        type : String,
    },
    author:{
        type:String, 
    },
},{ timestamps: true })

const blogs = mongoose.model("Blogs", blogsSchema);
module.exports = blogs;