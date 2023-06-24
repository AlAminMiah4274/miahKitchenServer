const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Miah Kitchen server');
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ubvegtf.mongodb.net/?retryWrites=true&w=majority`;

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
        const serviceCollection = client.db('miahKitchen').collection('services');
        const cateringDataCollection = client.db('miahKitchen').collection('cateringData');
        const reviewCollection = client.db('miahKitchen').collection('reviews');

        // to get limit food services data
        app.get('/service', async (rew, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });

        // to get all foods service data 
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        // to get individual food service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // to get catering service data
        app.get('/cateringData', async (req, res) => {
            const query = {};
            const cursor = cateringDataCollection.find(query);
            const data = await cursor.toArray();
            res.send(data);
        });

        // to send all reviews data to the database 
        app.post('/reviews', async (req, res) => {
            const text = req.body;
            const reviews = await reviewCollection.insertOne(text);
            res.send(reviews);
        });

        // to get all reviews data from database 
        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const allReviews = await cursor.toArray();
            res.send(allReviews);
        });

    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(err => console.error(err));

app.listen(port, () => {
    console.log(`Miah Kitchen server running on: ${port}`);
});