require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const core = require("cors");
const app = express();
const port = process.env.SERVER_PORT || 8000;

app.use(core());
app.use(express.json());

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
const watchListCollection = client.db("ChillGamer").collection("watchlist");

// post request
app.post("/reviews", async (req, res) => {
  const reviewCatch = req.body;

  const result = await reviewsCollection.insertOne(reviewCatch);
  res.send(result);
});

// watchList
app.post("/watchlist", async (req, res) => {
  const watchData = req.body;
  const result = await watchListCollection.insertOne(watchData);
  res.send(result);
});

app.get("/watchlist/:adminEmail", async (req, res) => {
  const myEmail = req.params.adminEmail;
  const query = { adminEmail: myEmail };
  const result = await watchListCollection.find(query).toArray();
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

app.get("/details/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await reviewsCollection.find(query).toArray();
  res.send(result);
});

// delete
app.delete("/my-review/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await reviewsCollection.deleteOne(query);
  res.send(result);
});

// update data
app.get("/update/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await reviewsCollection.find(query).toArray();
  res.send(result);
});

app.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const upCatchData = req.body;
  const query = { _id: new ObjectId(id) };
  const option = { $upsert: true };
  const upDateReview = {
    $set: {
      title: upCatchData.title,
      rating: upCatchData.rating,
      publishYear: upCatchData.publishYear,
      genres: upCatchData.genres,
      thumbnail: upCatchData.thumbnail,
      username: upCatchData.username,
      email: upCatchData.email,
      description: upCatchData.description,
    },
  };
  const result = await reviewsCollection.updateOne(query, upDateReview, option);
  res.send(result);
});

app.get("/reviews", async (req, res) => {
  const result = await reviewsCollection.find().toArray();
  res.send(result);
});

app.get("/reviews/:email", async (req, res) => {
  const emailKeep = req.params.email;
  const query = { email: emailKeep };
  const result = await reviewsCollection.find(query).toArray();
  res.send(result);
});

// user relative working
app.post("/users", async (req, res) => {
  const userCatch = req.body;
  const result = await usersCollection.insertOne(userCatch);
  res.send(result);
});

app.get("/users/:email", async (req, res) => {
  const emailCatch = req.params.email;
  const query = { email: emailCatch };
  const result = await usersCollection.find(query).toArray();
  res.send(result);
});

app.patch("/users/:email", async (req, res) => {
  const emailCatch = req.params.email;
  const userUpCatch = req.body;
  const query = { email: emailCatch };

  const upData = {
    $set: {
      lastSignInTime: userUpCatch.lastSignInTime,
    },
  };
  const result = await usersCollection.updateOne(query, upData);
  res.send(result);
});

app.listen(port, () => {
  console.log(`The chill game server running:${port}`);
});
