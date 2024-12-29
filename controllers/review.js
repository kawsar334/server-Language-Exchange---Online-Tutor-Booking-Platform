const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { userCollection, productCollection, reviewCollection } = require('../models/Models');
require('dotenv').config();

const uri = process.env.DB;

// Create a new review
const createReview = async (req, res) => {
    try {
        const newReview = req.body;
        newReview.createdAt = new Date();
        const result = await reviewCollection.insertOne(newReview);

        res.status(201).json({
            success: true,
            message: "Review created successfully.",
            data: result,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all reviews
const getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewCollection.find().sort({ createdAt: -1 }).toArray();

        res.status(200).json({
            success: true,
            message: "Reviews retrieved successfully.",
            data: reviews,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single review by ID
const getReviewById = async (req, res) => {
    try {
        const id = req.params.id;
        const review = await reviewCollection.findOne({ _id: new ObjectId(id) });

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found." });
        }

        res.status(200).json({
            success: true,
            message: "Review retrieved successfully.",
            data: review,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a review
const updateReview = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedFields = req.body;

        const filter = { _id: new ObjectId(id) };
        const updateDoc = { $set: updatedFields };

        const result = await reviewCollection.updateOne(filter, updateDoc);

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: "Review not found." });
        }

        res.status(200).json({
            success: true,
            message: "Review updated successfully.",
            data: result,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await reviewCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Review not found." });
        }

        res.status(200).json({
            success: true,
            message: "Review deleted successfully.",
            data: result,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createReview,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview,
};
