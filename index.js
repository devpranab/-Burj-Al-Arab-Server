const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

const port = 3008;

app.get("/", (req, res) => {
  res.send("Server Running");
});

//MongoDB Start
const uri = "mongodb+srv://arabianUser:arabianUser3453@cluster0.i8jndut.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("burjAlArab").collection("bookings");
  // perform actions on the collection object
  console.log("db connected success");
  client.close();
});
//MongoDB End

app.listen(port, () => {
  console.log(`App listening at http://localhost:3008`);
});