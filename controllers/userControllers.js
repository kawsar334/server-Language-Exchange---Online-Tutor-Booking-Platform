
const { userCollection, productCollection } = require('../models/Models');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');


const options = {
    // httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    // sameSite: 'strict',
    // maxAge: 60 * 60 * 1000,
    // httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    // sameSite: process.env.NODE_ENV === "production",

        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",

}

// const JWT_SECRET =process.env.JWT_SECRET
// register
const Register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await userCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        const userInfo = req.body

        const user = userCollection.insertOne(userInfo);
        const payload = { userId: newUser._id };
        // const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '' });
        const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.cookie('token', token, options);
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }


}


// Login 
const login = async (req, res) => {
    try {
        const { email, lastSignInTime } = req.body;
        let user;
        const emailExist = await userCollection.findOne({ email });
        if (emailExist) {
            const filter = { email };
            const updatedDoc = {
                $set: {
                    lastSignInTime,
                },
            };
            await userCollection.updateOne(filter, updatedDoc);
            user = await userCollection.findOne(filter);
        } else {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            user = await userCollection.findOne({ _id: result.insertedId });
        }

        const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.cookie('token', token, options);
        res.json({
            user,
            token
        });

    } catch (error) {
        console.error("Error handling user data:", error);
        res.status(500).send("An error occurred while processing user data");
    }
}


// update user
const updateUser = async (req, res) => {
    try {
        const email = req.body.email;
        const lastSignInTime = req.body?.lastSignInTime;
        let user = await userCollection.findOne({ email });
        if (user) {
            const filter = { email };
            const updatedDoc = {
                $set: {
                    lastSignInTime,
                },
            };
            await userCollection.updateOne(filter, updatedDoc);
            user = await userCollection.findOne({ email });
        } else {
            const newUser = { ...req.body };
            const insertResult = await userCollection.insertOne(newUser);
            user = await userCollection.findOne({ _id: insertResult.insertedId });
        }

        const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.cookie('token', token, options);

        res.send(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send(error );
    }
}
// const login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         let user = await userCollection.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ msg: 'Invalid credentials' });
//         }

//         const isMatch = await bcrypt.compare(password, userCollection.password);
//         if (!isMatch) {
//             return res.status(400).json({ msg: 'Invalid credentials' });
//         }

//         const payload = { userId: user.id };
//         const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '' });

//         res.json({ token });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// };


// get all user List 
const users = async (req, res) => {
    const cursor = userCollection.find();
    const result = await cursor.toArray();
    res.json(result);
}


const userDetails = async (req, res,) => {
    try {
        const id = req.params.id;
        const user = await userCollection.findOne({ _id: new ObjectId(id) });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);

    } catch (err) {
        console.error("Error getting user details:", err);
        res.status(500).send("An error occurred while processing the user");
    }
}

// delete single user
const deleteUser = async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await userCollection.deleteOne(query);
    res.json(result);
}


const Logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        // sameSite: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
        .send({ success: true, msg: "Logged out successfully!" });
}


module.exports = {
    users, login,
    updateUser,
    deleteUser,
    Register,
    userDetails,
    Logout

}

