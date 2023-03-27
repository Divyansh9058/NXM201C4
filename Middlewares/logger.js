const jwt=require("jsonwebtoken");
const {redisClient}=require("../routes/user")
const {usermodel} = require("../Models/user.model");
const {blackmodel} = require("../Models/blacklist.model");

require("dotenv").config();

const authentication=async(req,res,next)=>{
    const Token=req.headers?.authorization?.split(" ")[1];
    try {
        if(!Token){
            return res.status(401).send({msg:"please login first"});
        }
        client.sismember('blacklistedTokens', Token, (err, reply) => {
            if (err) {
              console.error(err);
              res.status(500).send('Error checking token');
            } else if (reply === 1) {
              console.log(`${Token} is blacklisted`);
              res.status(401).send('token is blacklisted');
            } else {
              console.log(`${Token} is authorized`);
              next();
            }
          });
    } catch (error) {
        res.send({msg:"something went wrong",error})
    }
}




module.exports = {authentication}