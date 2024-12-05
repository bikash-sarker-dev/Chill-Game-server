require("dotenv").config();
const express = require("express");
const core = require("cors");
const app = express();
const port = process.env.SERVER_PORT || 8000;

app.use(core());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yvlp9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`The chill game server open`);
});

// mongodb collection
const reviewsCollection = client.db("ChillGamer").collection("reviews");
const usersCollection = client.db("ChillGamer").collection("users");

// post request
app.post("/reviews", async (req, res) => {
  const reviewCatch = req.body;
  console.log(reviewCatch);
  const result = await reviewsCollection.insertOne(reviewCatch);
  res.send(result);
});

// get Response
app.get("/reviews/highest-rated", async (req, res) => {
  const result = await reviewsCollection
    .find()
    .sort({ rating: -1 })
    .limit(6)
    .toArray();
  res.send(result);
});

app.get("/reviews/latest", async (req, res) => {
  const result = await reviewsCollection
    .find()
    .sort({ $natural: -1 })
    .limit(3)
    .toArray();
  res.send(result);
});

// user relative working
app.post("/users", async (req, res) => {
  const userCatch = req.body;
  const result = await usersCollection.insertOne(userCatch);
  res.send(result);
});

app.listen(port, () => {
  console.log(`The chill game server running:${port}`);
});
