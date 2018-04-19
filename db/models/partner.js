var mongoose = require('mongoose');

var PartnerSchema =  new mongoose.Schema({
    fromVendorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoyaltyProgram'
    },
    toVendorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoyaltyProgram'
    }, 
    fromRate:{
        type: Number
    },
    toRate:{
        type: Number
    },
    minimum:{
        type:Number
    },
    maximum:{
        type:Number
    },
    perRound:{
        type:Number
    }
    
});

PartnerSchema.statics.addPartner = async function (partner) {
    try {
        let existFromPartner = await this.getPartner(partner.fromPartnerName);
        let existToPartner = await this.getPartner(partner.toPartnerName);

        if(existFromPartner && existToPartner){
            var newPartner = new this({
                fromVendorId:existFromPartner._id,
                toVendorId:existToPartner._id,
                fromRate:partner.fromRate,
                toRate:partner.toRate,
                minimum:partner.minimum,
                maximum:partner.maximum,
                perRound:partner.perRound
            });
            return await newPartner.save();
        }else{
            return Promise.reject('fail to add new partner');
        }

    } catch (e) {
        return Promise.reject(e);
    }
};

RoyaltyPromgramSchema.statics.getPartner = async function (rpName) {
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

RoyaltyPromgramSchema.statics.getPartnerList = async function () {
    let RoyaltyProgram = this;
    try {
        return await RoyaltyProgram.find().populate('fromVendorId').populate('toVendorId');
    } catch (e) {
        return Promise.reject(e);
    }
}

var Partner = mongoose.model('Partner', PartnerSchema);

module.exports = {Partner}