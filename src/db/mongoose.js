const mongoose = require('mongoose');
require('dotenv').config()
const connectDb = async () =>{
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MONGODB connected`);
}

connectDb()