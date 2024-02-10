const { MongoClient, ServerApiVersion, ObjectId  } = require('mongodb');

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2ltpfdm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    const userCollection = client.db("UsersInfo").collection("users");

    app.get("/users", async (req, res) => {
      try {
        const result = await userCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    app.post("/users", async (req, res) => {
        try {
          const newUser = req.body;
          console.log(newUser);
          const result = await userCollection.insertOne(newUser);
          res.send(result);
        } catch (error) {
          console.error('Error adding user:', error);
          res.status(500).send('Internal Server Error');
        }
      });
      
     app.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log('Received userId:', userId);

  try {
    const result = await userCollection.findOne({ _id: new ObjectId(userId) });
    console.log('User details result:', result);

    if (result) {
      res.send(result);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

      
      
        



























    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Users are online!");
});

app.listen(port, () => {
  console.log(`Users are sitting on port`, port);
});
