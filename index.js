const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); 

require('dotenv').config();
//tourist-manage
//xnIjTHyruE37e1oR
const port = 5000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xm07hcd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    const database = client.db("insertDB");
    const tourismCollection = database.collection("tourism");
    app.post('/tourisms',async(req,res)=>{
      const tourism = req.body;
      const result = await tourismCollection.insertOne(tourism);
      res.send(result);
      console.log(tourism);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.log);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
