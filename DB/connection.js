import mongoose from 'mongoose'

const connectDB = async(req, res)=>{
    try {
        await mongoose.connect(process.env.DB_URI)
        console.log("Connected to database");
    } catch (error) {
        console.log("Error connecting to database");
    }
}

export default connectDB;