const jwt=require("jsonwebtoken");

const {usermodel} = require("../Models/user.model");
const {blackmodel} = require("../Models/blacklist.model");

require("dotenv").config();

const authentication = async(req,res,next)=>{
    const token = req.headers?.authorization?.split(" ")[1];

    try{
        if(!token){
            return res.send({msg:"please login first"})
        }
        

        const blacklist = await blackmodel.find();

        for(let i=0;i<=blacklist.length-1;i++){

            if(blacklist[i].token==token){
                return res.send({msg:"You are blacklisted Try again"})
            }

        }

        const valid = await jwt.verify(token,process.env.token_key)


    }
    catch(e){

    }

}




module.exports = {authentication}