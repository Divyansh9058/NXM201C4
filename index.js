const express = require("express");
const { connection } = require("./configs/db");
const {userRouter} = require("./Routes/user.routes")
const {authentication} = require("./Middlewares/logger")
const app = express();
app.use(express.json())




require("dotenv").config();



app.use("/users",userRouter)
app.use(authentication)



app.listen(process.env.PORT,async()=>{

    try{
        await connection;
        console.log("Connected to DB")
    }
    catch(err){
        console.log(err.message)
    }

})