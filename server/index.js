const dotenv = require("dotenv")
const express = require("express")
const path = require("path")
const cors = require("cors")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const corsOptions = require("./config/corsOptions")
const {logger} = require("./middleware/logger")
const {logEvents} = require("./middleware/logger")
const errorHandler = require("./middleware/errorHandler")
const connectDB = require("./config/connectDB")

const app = express()
app.use(logger)
const PORT = process.env.PORT || 5000
dotenv.config()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
connectDB()


app.use("/", express.static(path.join(__dirname, "public")))


app.use("/", require("./routes/root"))
app.use("/users", require("./routes/userRoutes"))
app.use("/notes", require("./routes/noteRoutes"))


app.use("*", (req, res)=>{
    res.status(404)
    if(req.accepts("html")){
    res.sendFile(path.join(__dirname, "views", "404.html"))
    }else if(req.accepts("json")){
        res.json({message: "404 Not Found"})
    }else{
        res.type(txt).send("404 Not Found")
    }
})

app.use(errorHandler)

mongoose.connection.once("open", ()=>{
    app.listen(PORT, ()=>console.log(`Server running on PORT:${PORT}`))
})


mongoose.connection.on("error", err=>{
    console.log(err)
    logEvents(`${err.no} : ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log")
})