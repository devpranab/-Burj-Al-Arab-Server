const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

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
  
  app.post("/addBooking", (req, res) => {
   const newBooking = req.body;
   collection.insertOne(newBooking)
   .then(result => {
    console.log(result);
    res.send(result.insertedCount > 0);
   })
   console.log(newBooking);
  })

  app.get("/bookings", (req, res) => {
   console.log(req.query.email);
   collection.find({email: req.query.email})
   .toArray((err, documents) => {
    res.send(documents);
   })
  })
});
//MongoDB End

app.listen(port, () => {
  console.log(`App listening at http://localhost:3008`);
});