const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const userRoutes = require("./routes/uploadRoute");
app.use("/", userRoutes);

const fileRoutes = require("./routes/filesRoute");
app.use("/", fileRoutes);

app.get("/", (req,res)=>{
  res.send({
    status: 200,
    message:'Your app is running now'
  });
})

app.listen(PORT, ()=>{
  console.log("Server started");
});

// test db connection
const {pingTest} = require("./utils/dbConnector");
pingTest();


exports.app = app;
