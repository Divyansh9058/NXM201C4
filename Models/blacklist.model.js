const mongoose = require("mongoose");

const blackSchema = mongoose.Schema({
    token:{type:String, required:true}
});

const blackmodel = mongoose.model("black",blackSchema);

module.exports = {blackmodel}