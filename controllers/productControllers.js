const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { userCollection, productCollection, reviewCollection, BookCollection } = require('../models/Models');
const { sendSuccess, sendError } = require('../middlewares/ResponseMessage');

require('dotenv').config();

const uri = process.env.DB;

const createBookedial = async (req, res) => {
    try {
        const newproduct = req.body;
        const result = await productCollection.insertOne(newproduct);
        return sendSuccess(res, 200, 'Data created successfully', result);
    } catch (err) {
        return sendError(res, 400, 'server side error ');
    }
}

const products = async (req, res) => {
    const { language } = req.query;
    try {
        let cursor;

        if (language) {
            cursor = productCollection.find({
                language: { $regex: language, $options: "i" } 
            }).sort({ createdAt: -1 });
        } else {
           
            cursor = productCollection.find().sort({ createdAt: -1 });
        }
        const result = await cursor.toArray();
        return sendSuccess(res, 200, 'Data fetched successfully', result);
    } catch (err) {
        return sendError(res, 400, 'server side error ');;
    }
}

// gettin my productlist .  i created products
const getMyTutorials = async (req, res) => {
    try {
        const cursor = productCollection.find({ email: req.params.email }).sort({ createdAt: -1 })
        const result = await cursor.toArray();
        return sendSuccess(res, 200, 'Data fetched successfully', result);
    } catch (err) {
        return sendError(res, 400, 'server side error ');
    }
}
// get all proooductsssssssssssss
const getAllTutorials = async (req, res) => {
    try {
        const cursor = productCollection.find().sort({ createdAt: -1 })
        const result = await cursor.toArray();
        return sendSuccess(res, 200, 'Data fetched successfully', result);
    } catch (err) {
        return sendError(res, 400, 'server side error ');
    }
}




// gettingproduct by params id
const gettutorDetails = async (req, res) => {
    try {
        // const id = req.params.email;
        // const query = { _id: new ObjectId(id) };
        // const result = await productCollection.findOne(query);
        const email = req.params.email;
        const query = { email }; 
        const result = await productCollection.findOne(query);
        const userData = await userCollection.findOne(query);
        const data = {
            tutor: result,
            user: userData,
        }
        return sendSuccess(res, 200, 'Data fetched successfully', data);
    } catch (err) {
        return sendError(res, 400, 'something went wrong');
    }

}

//update product by params id
const updatedTutorial = async (req, res) => {
    try {
        const id = req.params.id;
        const { image, language, price, description } = req.body;

        const updatedTutorial = await productCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    image,
                    language,
                    price,
                    description,
                },
            }
        );

        res.status(200).json({ success: true, message: 'Tutorial updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating tutorial' });
    }
}



// delete product by params id 
const deleteTutorial = async (req, res) => {
    try {

        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await productCollection.deleteOne(query);
        res.status(200).json({
            message: 'Tutorials deleted successfully',
        });
    } catch (err) {
        return sendError(res, 400, 'something went wrong');
    }
}

// find language using query

const findLanguage = async (req, res) => {
    try {
        const language = req.query.language;
        if (!language) {
            return sendError(res, 400, 'Language parameter is required');
        }
        const query = { language: language.toLowerCase() };
        const result = await productCollection.find({ language:language}).toArray();

        if (result.length === 0) {
            return sendError(res, 404, 'No products found for this language');
        }
        return sendSuccess(res, 200, 'Data fetched successfully', result);
    } catch (err) {
        console.error(err);
        return sendError(res, 500, 'Something went wrong. Please try again later');
    }
};



// stats 

const stats = async (req, res) => {
    try {
        const review = await reviewCollection.find().toArray();  
        const product = await productCollection.find().toArray();  
        const tutor = await BookCollection.find().toArray();  
        const user = await userCollection.find().toArray();  

        const cleanReview = review.map(item => {
            const { client, ...rest } = item;  
            return rest;
        });

        const cleanProduct = product.map(item => {
            const { client, ...rest } = item;
            return rest;
        });

        const cleanTutor = tutor.map(item => {
            const { client, ...rest } = item;
            return rest;
        });
        const cleanUserList = user.map(item => {
            const { client, ...rest } = item;
            return rest;
        });
        const data = {
            review: cleanReview,
            product: cleanProduct,
            tutor: cleanTutor,
            user: cleanUserList
        };
        return sendSuccess(res, 200, 'Data updated successfully', data);
    } catch (err) {
        return sendError(res, 400, err.message);
    }
};


// get tutorial by tutoriaId 

const getTutorialByTutorialId = async (req, res) => {
    try {
        const id = req.params.tutorialId;
        const query = { _id: new ObjectId(id) };
        const result = await productCollection.findOne(query);
        return sendSuccess(res, 200, 'Data fetched successfully', result);
    } catch (err) {
        console.log(err)
        return sendError(res, 400, 'something went wrong');
    }
}

module.exports = {
    products,
    getMyTutorials,
    getAllTutorials,
    gettutorDetails,
    createBookedial,
    updatedTutorial,
    deleteTutorial,
    stats,
    findLanguage,
    getTutorialByTutorialId,
}