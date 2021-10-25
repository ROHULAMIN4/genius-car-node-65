const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = 5000;
// middle were
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4vnd1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("geniusMachanic");
    const serviceCollecton = database.collection("services");
    // GET API
    app.get("/services", async (req, res) => {
      const cursor = serviceCollecton.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    // SINGLE SERVICE API
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollecton.findOne(query);
      res.json(service);
    });
    // POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollecton.insertOne(service);

      res.json(result);
    });
    // DELETE API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollecton.deleteOne(query);
      res.json(service);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  console.log("runnig geuious server");
  res.send("genious server ");
});
app.listen(port, () => {
  console.log("stat server in listen item", port);
});
