// index.js

const express = require("express");
const app = express();
const cors = require("cors"); 
const http = require("http");
require("dotenv").config();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

app.use(
    cors({
      origin: [ "http://localhost:3000", process.env.IP_ADDRESS],
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization", "x-verify"],
    })
  );
  
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes")


mongoose.set("strictQuery", true);


mongoose
  .connect(process.env.DB_URL)
  .then((res) => console.log("database connected"))
  .catch((err) => console.log(err.message + "err"));
app.use(express.json());


app.use("/users", userRoutes);


const PORT = 8080;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});





