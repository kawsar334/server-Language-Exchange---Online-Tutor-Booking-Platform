const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


require('dotenv').config();

const uri = process.env.DB;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


const database = client.db('LanguageExchange');
const productCollection = database.collection('Tutor');
const userCollection = client.db('LanguageExchange').collection('Users');
const reviewCollection = database.collection('reviews');
const BookCollection = database.collection("Booked");
module.exports={
    productCollection,
    userCollection,
    BookCollection,
    reviewCollection,
}