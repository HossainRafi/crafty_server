const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eru2v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const productCollection = client.db("crafty").collection("product");
    const orderCollection = client.db("crafty").collection("order");
    const userCollection = client.db("crafty").collection("user");
    const reviewCollection = client.db("crafty").collection("review");

    //========== All Products API ==========
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //========== Single Product API ==========
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    //========== Purchase Product API ==========
    app.post("/product", async (req, res) => {
      const product = req.body.purchase;
      const result = await orderCollection.insertOne(product);
      res.send(result);
    });

    //========== Get User Filtering By Email ==========
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    //========== Update User For Profile ==========
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const profile = req.body;
      console.log(profile);
      const query = { email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: profile.name,
          email: profile.email,
          education: profile.education,
          linkedIn: profile.linkedIn,
          location: profile.location,
          phone: profile.phone,
        },
      };
      const result = await userCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    //========== Post Review API ==========
    app.post("/review", async (req, res) => {
      const review = req.body;
      console.log(review);
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    //========== Get Review API ==========
    app.get("/review", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    //========== Get User Filtering By Email ==========
    app.get("/order", async (req, res) => {
      const result = await orderCollection.find().toArray();
      res.send(result);
    });

    //========== Product Delete API ==========
    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(filter);
      res.send(result);
    });

    //========== Add Product API ==========
    app.post("/product", async (req, res) => {
      const product = req.body.newProduct;
      console.log(product);
      const result = await productCollection.insertOne(product);
      res.send(result);
    });
    //===============================================================================
  } finally {
    //    client.close();
  }
}
run().catch(console.dir);
//================================================================================
app.get("/", (req, res) => {
  res.send("Server Is Running....................");
});

app.listen(port, () => {
  console.log(
    "Server Is Running In The Command Line",
    port,
    "............................"
  );
});
