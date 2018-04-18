const mongoose = require('mongoose');

let RoyaltyPromgramSchema = new mongoose.Schema({
    name:{
        type:String
    },
    img:{
        type:String
    },
    vendor:{
        type:String
    },
    termAndCondition:{
        type: String,
        trim:true
    }
});

RoyaltyPromgramSchema.statics.addRoyaltyProgram = async function (rp){
    rp.name = rp.name.toUpperCase();
    rp.vendor = rp.vendor.toUpperCase();
    var newRP = new this(rp);
    try{
        let existRP = await this.getRoyaltyPromgram(rp.name);      
        if (existRP) {
            return existRP
        } else {
            return await newRP.save();
        }
    }catch(e){
        return Promise.reject(e);
    }
};

RoyaltyPromgramSchema.statics.getRoyaltyPromgram = async function (rpName) {    
    rpName = rpName.toUpperCase();
    let RoyaltyProgram = this;
    try {
        return await RoyaltyProgram.findOne({
            name: rpName
        });
    } catch (e) {
        return Promise.reject(e);
    }
}


RoyaltyPromgramSchema.statics.getRoyaltyPromgramList = async function () {    

    let RoyaltyProgram = this;
    try {
        return await RoyaltyProgram.find();
    } catch (e) {
        return Promise.reject(e);
    }
}

var RoyaltyProgram = mongoose.model('RoyaltyProgram', RoyaltyPromgramSchema);

module.exports = { RoyaltyProgram }