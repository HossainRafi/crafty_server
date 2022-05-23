//================ Common Code Start =============
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
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
client.connect((err) => {
  const productCollection = client.db("crafty").collection("product");
  client.close();
});
//================ Common Code End =============
// run().catch(console.dir);





// =====================================================================
app.get("/", (req, res) => {
  res.send("Server Is Running....................");
});

app.listen(port, () => {
  console.log("Server Is Running In The Command Line", port, "............................");
});