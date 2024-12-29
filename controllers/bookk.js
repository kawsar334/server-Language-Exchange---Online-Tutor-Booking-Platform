const { ObjectId } = require('mongodb');
const { BookCollection, productCollection } = require('../models/Models'); // Assume BookCollection is defined in Models

// Create a new tutor
const createBooked = async (req, res) => {
    // try {

    //     const userEmail = await BookCollection.findOne(req.body.userEmail)
    //     if(userEmail){
    //         res.status(201).json({
    //             success: true,
    //             message: "This tutor already booked",
            
    //         });  
    //     }
    //     const newTutor = req.body;
    //     newTutor.createdAt = new Date();
    //     const result = await BookCollection.insertOne(newTutor);
    //     res.status(201).json({
    //         success: true,
    //         message: "Booked succesfully ",
    //         data: result,
    //     });
    // } catch (error) {
    //     res.status(500).json({ success: false, message: error.message });
    // }
    try {
        // Check if the user has already booked this tutor
        const { userEmail, tutorId } = req.body; // Assuming req.body contains userEmail and tutorId
        const existingBooking = await BookCollection.findOne({ userEmail, tutorId });

        if (existingBooking) {
            return res.status(201).json({
                success: false,
                message: "This tutor is already booked",
            });
        }

        // Create a new booking
        const newTutor = { ...req.body, createdAt: new Date() };
        const result = await BookCollection.insertOne(newTutor);

        return res.status(201).json({
            success: true,
            message: "Booked successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get all tutors
// const getMyBookedTutorial = async (req, res) => {
//     try {

//         const email = req.params.email;
//         const query = { email };
//         const tutors = await BookCollection.find(query).sort({ createdAt: -1 }).toArray();
//         res.status(200).json({
//             success: true,
//             message: "Tutors retrieved successfully.",
//             data: tutors,
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

const getMyBookedTutorial = async (req, res) => {
    try {
        const email = req.params.email;
        const query = { email };
        const tutors = await BookCollection.find({userEmail:email}).sort({ createdAt: -1 }).toArray();

        if (tutors.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No tutors found for this email.",
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: "Tutors retrieved successfully.",
            data: tutors,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get a single tutor by ID
const getMyBookedTutorialById = async (req, res) => {
    try {
        const id = req.params.id;
        const tutor = await BookCollection.findOne({ _id: new ObjectId(id) });

        if (!tutor) {
            return res.status(404).json({ success: false, message: "Tutor not found." });
        }

        res.status(200).json({
            success: true,
            message: "Tutor retrieved successfully.",
            data: tutor,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a tutor
const updateBooked = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedFields = req.body;

        const filter = { _id: new ObjectId(id) };
        const updateDoc = { $set: updatedFields };

        const result = await BookCollection.updateOne(filter, updateDoc);

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: "Tutor not found." });
        }

        res.status(200).json({
            success: true,
            message: "Tutor updated successfully.",
            data: result,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a tutor
const deleteBooked = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await BookCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Tutor not found." });
        }

        res.status(200).json({
            success: true,
            message: "Tutor deleted successfully.",
            data: result,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const updateTutorReview = async (req, res) => {
    try {
        const { tutorId } = req.params; 
        const productResult = await productCollection.updateOne(
            { _id: new ObjectId(tutorId) },
            { $inc: { review: 1 } }   
        );

        
        const tutor = await BookCollection.findOne({ tutorId: tutorId });
        const bookResult = await BookCollection.updateOne(
            { tutorId: tutorId },
            { $inc: { review: 1 } }         
        );

        if (productResult.matchedCount === 0 && bookResult.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Tutor not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Review count increased successfully",
            // tutor,
            bookResult,
            productResult
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
    createBooked,
    getMyBookedTutorial,
    getMyBookedTutorialById,
    updateBooked,
    deleteBooked,
    updateTutorReview,
};
