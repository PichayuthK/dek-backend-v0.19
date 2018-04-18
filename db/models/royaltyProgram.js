const mongoose = require('mongoose');
let composerRoyaltyProgram = require('./../../composer/royaltyProgram');

let RoyaltyPromgramSchema = new mongoose.Schema({
    name: {
        type: String
    },
    img: {
        type: String
    },
    vendor: {
        type: String
    },
    termAndCondition: {
        type: String,
        trim: true
    }
});

RoyaltyPromgramSchema.statics.addRoyaltyProgram = async function (rp) {
    rp.name = rp.name.toUpperCase();
    rp.vendor = rp.vendor.toUpperCase();
    var newRP = new this(rp);
    try {
        let existRP = await this.getRoyaltyPromgram(rp.name);
        if (existRP) {
            return existRP
        } else {
            return await newRP.save();
        }
    } catch (e) {
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
    console.log('get rp list');
    let RoyaltyProgram = this;
    try {
        let dbRoyaltyProgram = (await RoyaltyProgram.find({}));
        console.log(dbRoyaltyProgram);
        let cpRoyaltyProgram = await composerRoyaltyProgram.getRoyaltyProgramList();
      //  console.log(cpRoyaltyProgram);

        let mappingRP = [];
        dbRoyaltyProgram.forEach(rp => {
            cpRoyaltyProgram.forEach(e => {
                //console.log(`rp: ${rp.name} | compsoerRP: ${e.royaltyProgramName}`);
                if (rp.name == e.royaltyProgramName) {
                    let temp = {
                        royaltyProgramId: e.royaltyProgramId,
                        name: rp.name,
                        img: rp.img,
                        vendor: rp.vendor,
                        termAndCondition: rp.termAndCondition
                    };
                    mappingRP.push(temp);
                }
            });
        });
        console.log(mappingRP);
        return Promise.resolve(mappingRP);
    } catch (e) {
        return Promise.reject(e);
    }
}

var RoyaltyProgram = mongoose.model('RoyaltyProgram', RoyaltyPromgramSchema);

module.exports = {
    RoyaltyProgram
}