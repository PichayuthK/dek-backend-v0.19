const mongoose = require('mongoose');

let RoyaltyPromgramSchema = new mongoose.Schema({
    name:{
        type:String
    },
    img:{
        type:String
    },
    termAndCondition:{
        type: String,
        trim:true
    }
});

RoyaltyPromgramSchema.statics.addRoyaltyPromgramSchema = async function (rp){
    var newRP = new this;
};

var RoyaltyProgram = mongoose.model('RoyaltyProgram', RoyaltyPromgramSchema);

module.exports = { RoyaltyProgram }