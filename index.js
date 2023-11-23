const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config()
const port = process.env.PORT || 5000;

//  middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dinkriz.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)

    const users = client.db("bossDB").collection("users")
    const alldata = client.db("bossDB").collection("bossname")
    const reviews = client.db("bossDB").collection("reviews")
    const carts = client.db("bossDB").collection("carts")

    app.post('/users', async (req, res) => {
      const user = req.body
      const result = await users.insertOne(user)
      res.send(result)
    })

    app.get("/alldatas", async (req, res) => {
      const result = await alldata.find().toArray()
      res.send(result)
    })

    app.get("/reviews", async (req, res) => {
      const result = await reviews.find().toArray()
      res.send(result)
    })

    app.post('/carts', async (req, res) => {
      const cartItem = req.body
      const result = await carts.insertOne(cartItem)
      res.send(result)
    })

    app.get('/carts', async (req, res) => {
      const email = req.query.email;
      const query = { email: email }
      const result = await carts.find(query).toArray()
      res.send(result)
    });

    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id
      console.log(id)
      const query = { _id: new ObjectId(id) }
      const result = await carts.deleteOne(query)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('boss still here')
})

app.listen(port, () => {
  console.log(`boss port is running${port}`);
})
