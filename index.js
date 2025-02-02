const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://masu-ake.netlify.app"],
  credentials: true
}));
app.use(express.json())

// masu-ake
// WqLz4Fd7uYvDzWZy



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gcdnfa1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const craftCollection = client.db("masuAkeDB").collection("craftDB");
const categoryCollection = client.db("masuAkeDB").collection("categoryDB");


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Craft Posting
    app.post("/addCraft", async (req, res) => {
      const newCraft = req.body
      const result = await craftCollection.insertOne(newCraft)
      res.send(result)
    })
    // All Craft Getting
    app.get("/allCraft", async (req, res) => {
      const allCraft = await craftCollection.find().toArray();
      res.send(allCraft)
    })

    // Single Craft Getting
    app.get("/craftDetails/:id", async (req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const singleCraft = await craftCollection.findOne(query);
      res.send(singleCraft)
    })

    // user all craft getting
    app.get("/userCraft/:email", async (req, res) => {
      const UserEmail = req.params.email
      const filter = { email: UserEmail };
      const result =await craftCollection.find(filter).toArray()
      res.send(result)
    })

    // Craft getting by subcategory
    app.get("/catgoryCraft/:category", async (req, res) => {
      const forCategory = req.params.category;
      const filter = { subCategory: forCategory };
      const result = await craftCollection.find(filter).toArray();
      res.send(result)
    })

    // delete a craft
    app.delete("/removeCraft/:id", async(req, res) => {
      const craftId = req.params.id;
      const query = { _id: new ObjectId(craftId) };
      const result =await craftCollection.deleteOne(query);
      res.send(result)
    })
    // Update a craft
    app.put("/updateCraft/:id", async(req, res) => {
      const craftId = req.params.id;
      const filter = { _id: new ObjectId(craftId) };
      const options = { upsert: false };
      const updateValue = req.body
      const updatedValue = {
        $set:{
            name:updateValue.name,
            image:updateValue.image,
            description:updateValue.description,
            subCategory:updateValue.subCategory,
            stock:updateValue.stock,
            customization:updateValue.customization,
            price:updateValue.price,
            proccessingTime:updateValue.proccessingTime,
        }
    }
    const result = await craftCollection.updateOne(filter,updatedValue,options)
      res.send(result)
    })


    // Category Adding
    app.post("/addCategory", async (req, res) => {
      const newCraft = req.body
      const result = await categoryCollection.insertOne(newCraft)
      res.send(result)
    })
    // Category Getting
    app.get("/categories", async (req, res) => {
      const allCatergory = await categoryCollection.find().toArray();
      res.send(allCatergory)
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("Coffee server is running")
})

app.listen(port, () => {
  console.log(`Server Running at port : ${port}`)
})