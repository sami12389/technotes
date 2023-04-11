const mongoose = require("mongoose")

const connectDB = async()=>{
    try {
    await mongoose.connect(process.env.CONNECTION_URL) 
    console.log("Connected to MONGO")
    } catch (error) {
    console.log(error)
    }
}

module.exports = connectDB