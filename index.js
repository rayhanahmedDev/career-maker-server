const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;


// middleware
// career-maker-assignment
// NG2G5PMXUVuOPE3L
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.or5ssuz.mongodb.net/?retryWrites=true&w=majority`;


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
    const servicesCollection = client.db('careerDB').collection('career');
    const addServiceCollection = client.db('addServiceDB').collection('addService')
    const bookedCollection = client.db('bookedDB').collection('booked')
    // services section
    app.get('/services',async(req,res)=>{
        const result = await servicesCollection.find().toArray()
        res.send(result)
    })

    // single services data
    app.get('/services/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await servicesCollection.findOne(query);
      res.send(result)
    })

    // add services
    app.post('/users', async(req,res) => {
      const user = req.body;
      const result = await addServiceCollection.insertOne(user)
      res.send(result)
    })

    // get the add services
    app.get('/userService',async(req,res) => {
      const result = await addServiceCollection.find().toArray()
      res.send(result)
    })

    // get the specific data
    app.get('/userService/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await addServiceCollection.findOne(query)
      res.send(result)
    })

    // delete specific data
    app.delete('/userService/:id',async(req,res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result= await addServiceCollection.deleteOne(query)
      res.send(result)
    })

    // update services
    app.put('/userService/:id',async(req,res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updateService = {
        $set : {
          serviceArea : data.serviceArea,
            serviceName : data.serviceName,
            name: data.name,
            price: data.price,
            description:data.description,
            yourEmail: data.yourEmail,
            photo : data.photo
        }
      }
      const result = await addServiceCollection.updateOne(filter,updateService,options)
      res.send(result)
    })

    // booked collection
    app.post('/booking',async(req,res) => {
      const data = req.body;
      const result = await bookedCollection.insertOne(data)
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



app.get("/", (req, res) => {
    res.send("Career Maker is running...");
});

app.listen(port, () => {
    console.log(`Simple Crud is Running on port ${port}`);
});