
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { users, login, updateUser, deleteUser, Register, userDetails, Logout } = require('./controllers/userControllers');
const { products, getMyTutorials, getAllTutorials, gettutorDetails, createBookedial, updatedTutorial, deleteTutorial, stats, findLanguage, getTutorialByTutorialId } = require('./controllers/productControllers');
const jwtMiddleware = require('./middlewares/Middlewares');
const { createReview, getAllReviews, getReviewById, updateReview, deleteReview } = require('./controllers/review');
const { createBooked, getMyBookedTutorial, getMyBookedTutorialById, updateBooked, deleteBooked, updateTutorReview } = require('./controllers/bookk');
const { sendSuccess, sendError } = require('./middlewares/ResponseMessage');
const { ObjectId } = require('mongodb');
const { productCollection } = require('./models/Models');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cookieParser());
app.use(express.json());


const allowedOrigins = [
    'http://localhost:5173',
    'https://gorgeous-shortbread-b2c9fe.netlify.app',
];

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, 
}));



async function run() {
    try {

        // jwt verified 
        app.get("/jwt", (req, res,) => {
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ success: false, message: 'You are Not authenticated please register/login' });
            }
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded;
                res.json({ success: true, message: 'User authenticated', user: req.user });
            } catch (error) {
                return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
            }
        });


        
        // add a product 
        app.post('/addtutorial', createBookedial);
        app.get('/products', products);
        // getting all tutorials
        app.get('/allproducts', getAllTutorials);
        // gettin my productlist .  i created products 
        app.get('/mytutorials/:email', jwtMiddleware, getMyTutorials);
        // getTutorialByTutorialId
        app.get("/tutorial/:tutorialId", getTutorialByTutorialId)
        // gettin a single tutorial
        app.get('/tutor/:email', gettutorDetails)
        app.get("/findLanguage/", findLanguage)
        // update tutorial
        app.put('/updateTutorial/:id', updatedTutorial)
        // app.put('/tutorial/:id', "getSingleTutorialdetails")

        // delete tutorial
        app.delete('/tutorial/:id', deleteTutorial)


        // Users related apis*************************************
        app.post("/register", Register)
        app.post('/users', login);
        // get userlist
        app.get('/users', users);
        app.patch('/users', updateUser);
        app.get('/user/find/:id', userDetails);
        app.post('/logout', Logout )

        // delete user
        app.delete('/users/:id', deleteUser);

        // tutors ====================================
        app.post("/addbooked", createBooked);
        app.get('/mybooked/:email', getMyBookedTutorial);
        app.patch('/updatedReview/:tutorId', updateTutorReview);

        // updateTutorReview 


        // reviews ========================


        // stats 
        app.get("/stats", stats)
    } finally {

    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.json('Language Exchange api is working *****************')
});

app.listen(port, () => {
    console.log(`product is getting warmer in port: ${port}`);
})
