var mongoose = require('mongoose');
var { RoyaltyProgram }= require('./royaltyProgram');

var PartnerSchema = new mongoose.Schema({
    fromVendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoyaltyProgram'
    },
    toVendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoyaltyProgram'
    },
    fromRate: {
        type: Number
    },
    toRate: {
        type: Number
    },
    minimum: {
        type: Number
    },
    maximum: {
        type: Number
    },
    perRound: {
        type: Number
    }

});

PartnerSchema.statics.addPartner = async function (partner) {
    //try {
    let existFromPartner = await RoyaltyProgram.getRoyaltyPromgram(partner.fromPartnerName);
    let existToPartner = await RoyaltyProgram.getRoyaltyPromgram(partner.toPartnerName);
    console.log(existFromPartner);
    if (existFromPartner && existToPartner) {
        var newPartner = new this({
            fromVendorId: existFromPartner._id,
            toVendorId: existToPartner._id,
            fromRate: partner.fromRate,
            toRate: partner.toRate,
            minimum: partner.minimum,
            maximum: partner.maximum,
            perRound: partner.perRound
        });
        return await newPartner.save();
    } else {
        return Promise.reject('fail to add new partner');
    }

    // } catch (e) {
    return Promise.reject(e);
    // }
};

PartnerSchema.statics.getPartner = async function (rpName) {
    console.log('getPartner: ', rpName);
    rpName = rpName.toUpperCase();
    let Partner = this;
    try {
        return await Partner.findOne({
            name: rpName
        });
    } catch (e) {
        return Promise.reject(e);
    }
};

PartnerSchema.statics.getPartnerList = async function (rpName) {
    rpName = rpName.toUpperCase();
    let Partner = this;
    try {
        let rpId = await RoyaltyProgram.getRoyaltyPromgram(rpName);
        console.log(rpId);
        return await Partner.find({fromVendorId: rpId._id}).populate('fromVendorId').populate('toVendorId');
    } catch (e) {
        return Promise.reject(e);
    }
};

var Partner = mongoose.model('Partner', PartnerSchema);

module.exports = {
    Partner
}