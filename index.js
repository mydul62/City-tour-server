const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

require("dotenv").config();
//tourist-manage
//xnIjTHyruE37e1oR
const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xm07hcd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const database = client.db("insertDB");
    const tourismCollection = database.collection("tourism");
    const CountryCollections = database.collection("country");
    const reviewCollections = database.collection("review");
    app.get("/review", async (req, res) => {
      const cursor = reviewCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/tourisms", async (req, res) => {
      const cursor = tourismCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/country/countrys", async (req, res) => {
      const cursor = CountryCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/tourisms/email/country/:countryname", async (req, res) => {
      const countryname = req.params.countryname;
      const result = await tourismCollection
        .find({ countryname: countryname })
        .toArray();
      res.send(result);
    });
    app.get("/tourisms/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tourismCollection.findOne(query);
      res.send(result);
    });
    app.get("/tourisms/email/:useremail", async (req, res) => {
      console.log(req.params);
      const email = req.params.useremail;
      const result = await tourismCollection.find({ useremail: email }).toArray();
      res.send(result);
    });
    app.delete("/tourisms/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tourismCollection.deleteOne(query);

      res.send(result);
    });
    app.put("/tourisms/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedTourism = req.body;
      const options = { upsert: true };
      const tourism = {
        $set: {
          Touristsportname: updatedTourism.Touristsportname,
          Rating: updatedTourism.Rating,
          averagecost: updatedTourism.averagecost,
          countryname: updatedTourism.countryname,
          location: updatedTourism.location,
          photoURL1: updatedTourism.photoURL1,
          photoURL2: updatedTourism.photoURL2,
          photoURL3: updatedTourism.photoURL3,
          photoURL4: updatedTourism.photoURL4,
          seasonality: updatedTourism.seasonality,
          shortdescription: updatedTourism.shortdescription,
          totalVisitorsPerYear: updatedTourism.totalVisitorsPerYear,
          traveltime: updatedTourism.traveltime,
          useremail: updatedTourism.useremail,
        },
      };
      console.log(id);
      const result = await tourismCollection.updateOne(
        filter,
        tourism,
        options
      );
      res.send(result);
    });

    app.post("/tourisms", async (req, res) => {
      const tourism = req.body;
      const result = await tourismCollection.insertOne(tourism);
      res.send(result);
      console.log(tourism);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.log);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
