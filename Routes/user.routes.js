const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
const userRouter = express.Router();
const {usermodel} = require("../Models/user.model");
const {blackmodel} = require("../Models/blacklist.model");
const fs  = require("fs")

const app = express();
app.use(express.json())



userRouter.post("/signup",async (req,res)=>{

    const {name,email,password} = req.body;

    try{

        bcrypt.hash(password,5,async(err,hash)=>{
            if(err){
                res.send({msg:"smething went wrong"})
            }else{
                const user = new usermodel({name,email,password:hash});
                await user.save();
                res.send({msg:"User has successfully register"});
            }
        })


    }
    catch(e){
        res.send({msg:"Something went wrong"});
    }

})

userRouter.post("login",async(req,res)=>{

    try{
        const {email,password} = req.body;
        const userpresent = await usermodel.findOne({email:email});
        if(!userpresent){
            return res.send({msg:"User not present, Please enter correct email"})
        }

        const rightpassword = await bcrypt.compareSync(password,userpresent.password);

        if(!rightpassword){
            return res.send({msg:"Wrng Credentials"})
        }

        const token = await jwt.sign({email,userid:userpresent._id},prcess.env.token_key,{expiresIn:"1h"})

        const ref_token = await jwt.sign({email,userid:userpresent._id},process.env.ref_token_key,{expiresIn:"1h"})

            res.send({msg:"Login successfull"})

    }
    catch(e){
        res.send({msg:"Something went wrong"})
    }


})

// userRouter.get("/logout",async(req,res)=>{
//     const token = req.headers.authorization.split(" ")[1];
//     try{

//         const blacklist_user = new blackmodel({token});
//         await blacklist_user.save();

//         const blacklist = JSON.parse(fs.readFileSync("./Blacklist.json","utf-8"));

//         blacklist.push(token)

//         fs.writeFileSync("./Blacklist.json", JSON.stringify(blacklist))

//         res.send({msg:"logout Succcessfully"})
//     }
//     catch(e){
//         res.send({msg:"something went wrong"})
//     }
// })
userRouter.get("/logout",async(req,res)=>{
    try {
        let  token=req.headers.authorization.split(" ")[1];
        redisClient.sadd('blacklistedTokens', token, (err,reply) => {
            if (err) {
              console.error(err);
              res.status(500).send('Error blacklisting token');
            } else {
              console.log(`${token} has been blacklisted`);
              res.status(200).send('Token blacklisted successfully');
            }
          });
    } catch (error) {
        res.send({msg:"something went wrong",error:error.message}) 
    }
})

userRouter.get("/getnewtoken",async(req,res)=>{
    const ref_token = req.headers.authorization.split(" ")[1];
    if(!ref_token){
        res.send({msg:"please login again"})
    }

    jwt.verify(ref_token,process.env.ref_token_key,async(err,decoded)=>{

        if(!decoded){
            res.send({msg:"Please login again"})
        }else{
            const token = await jwt.sign({email:decoded.email,userid:decoded.userid},process.env.token_key,{expiredIn:"1m"});

            res.send({msg:"login successfull","new token":token})
        }

    })

})




module.exports = {userRouter,redisClient}