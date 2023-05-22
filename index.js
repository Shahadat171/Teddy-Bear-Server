const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const teddyBear = require("./Data/teddyBear.json");

//midleware

// WDOFlT9lPFfO3qPW
// teddy-bear

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kfi6tak.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
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

    const teddyBearCollection = client
      .db("teddybearDB")
      .collection("teddybear");

    app.get("/teddyBear", async (req, res) => {
      const cursor = teddyBearCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/teddyBear/:type", async (req, res) => {
      const result = await teddyBearCollection
        .find({ type: req.params.type })
        .toArray();
         res.send(result);
    });

    app.get("/myTeddyBear", async (req, res) => {
      let query = {};
      if (req.query?.sellerEmail) {
        query = { sellerEmail: req.query.sellerEmail };
      }
      const result = await teddyBearCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/singleTeddyBear/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      // const options = {
      //     // Include only the `title` and `imdb` fields in the returned document
      //     projection: { name: 1, price: 1, image: 1 },
      // };
      const result = await teddyBearCollection.findOne(query);
      res.send(result);
  })

    app.post("/teddyBear", async (req, res) => {
      const newTeddyBear = req.body;
      console.log(newTeddyBear);
      const result = await teddyBearCollection.insertOne(newTeddyBear);
      res.send(result);
    });
    
    app.put('/updateSingleTeddyBear/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { uspsert : true }
      const updatedTeddyBear = req.body;
      const teddyBear = {
          $set: {
            name : updatedTeddyBear.name,
            image : updatedTeddyBear.image,
            sellerName : updatedTeddyBear.image,
            sellerEmail : updatedTeddyBear.sellerEmail,
            type : updatedTeddyBear.type,
            rating : updatedTeddyBear.rating,
            price : updatedTeddyBear.price,
            quantity : updatedTeddyBear.quantity,
            description : updatedTeddyBear.description
          },
      };
      console.log(teddyBear)
      const result = await teddyBearCollection.updateOne(filter, teddyBear, options);
      res.send(result);
  })


    app.delete("/myTeddyBear/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) };
      const result = await teddyBearCollection.deleteOne(query);
      res.send(result);
    });

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
  res.send("Teddy bear is coming");
});

app.listen(port, () => {
  console.log(`Teddy bear API is running on port : ${port}`);
});
