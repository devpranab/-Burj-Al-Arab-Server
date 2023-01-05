const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
var admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 3008;

app.get("/", (req, res) => {
  res.send("Server Running");
});

//keep in index.js to Admin SDK configuration snippet code
var serviceAccount = require("./burj-al-arab-auth-aa3e9-firebase-adminsdk-ip9my-b0a698f82f");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//MongoDB Start
const uri =
  "mongodb+srv://arabianUser:arabianUser3453@cluster0.i8jndut.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("burjAlArab").collection("bookings");
  // perform actions on the collection object
  console.log("db connected success");

  //POST
  app.post("/addBooking", (req, res) => {
    const newBooking = req.body;
    collection.insertOne(newBooking).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
    console.log(newBooking);
  });

  //GET
  app.get("/bookings", (req, res) => {
    //console.log(req.query.email);
    const bearer = req.headers.authorization;
    if (bearer && bearer.startsWith("Bearer ")) {
      const idToken = bearer.split(" ")[1];
      console.log({ idToken });
      // idToken comes from the client app
      admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
          const tokenEmail = decodedToken.email;
          const queryEmail = req.query.email;
          console.log(tokenEmail, queryEmail);

          if (tokenEmail == req.query.email) {
            console.log(req.headers.authorization);
            collection
              .find({ email: req.query.email })
              .toArray((err, documents) => {
                res.send(documents);
              });
          }
        })
        .catch((error) => {
          // Handle error
        });
    }
  });
});
//MongoDB End

app.listen(port, () => {
  console.log(`App listening at http://localhost:3008`);
});
