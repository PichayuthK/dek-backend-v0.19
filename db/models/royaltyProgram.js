const mongoose = require('mongoose');
let composerRoyaltyProgram = require('./../../composer/royaltyProgram');
let composerUser = require('./../../composer/user');
let composerPoint = require('./../../composer/point');

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
       // console.log(dbRoyaltyProgram);
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
       // console.log('mappingRP: ',mappingRP);
        return Promise.resolve(mappingRP);
    } catch (e) {
        return Promise.reject(e);
    }
}

RoyaltyPromgramSchema.statics.getRoyaltyPromgramPointTransferFromVendor = async function (rpId) {    
    try {
        let userPointTransferList = await composerPoint.getPoinTransferHistoryFromVendor(rpId);
        //let cpCard = await composerCard.getCardHistory(userId,cardId);
        let rpList = await RoyaltyProgram.getRoyaltyPromgramList();

        let mapUserOldCards = [];
        userPointTransferList.forEach(card => {
            rpList.forEach(rp => {
                //console.log(rp.royaltyProgramId,' : ', card.oldCardRoyaltyProgramId);
                if(rp.royaltyProgramId == card.oldCardRoyaltyProgramId.trim()){
                    let temp = Object.assign({
                        oldRoyaltyProgramName: rp.name,
                        oldRoyaltyProgramImg:rp.img,
                        oldRoyaltyProgramVendor: rp.vendor
                    },card);
                    mapUserOldCards.push(temp);
                    //console.log('temp: ',temp);
                }
            });
        });

        let mapUserNewCards = [];
        mapUserOldCards.forEach(card => {
            rpList.forEach(rp => {
                //console.log(rp.royaltyProgramId,' : ', card.oldCardRoyaltyProgramId);
                if(rp.royaltyProgramId == card.newCardRoyaltyProgramId.trim()){
                    let temp = Object.assign({
                        newRoyaltyProgramName: rp.name,
                        newRoyaltyProgramImg:rp.img,
                        newRoyaltyProgramVendor: rp.vendor
                    },card);
                    mapUserNewCards.push(temp);
                    //console.log('temp: ',temp);
                }
            });
        });

        return Promise.resolve(mapUserNewCards);

    } catch (e) {
        return Promise.reject(e);
    }
}

RoyaltyPromgramSchema.statics.getRoyaltyPromgramPointTransferToVendor = async function (rpId) {    
    try {
        let userPointTransferList = await composerPoint.getPoinTransferHistoryToVendor(rpId);
        //let cpCard = await composerCard.getCardHistory(userId,cardId);
        let rpList = await RoyaltyProgram.getRoyaltyPromgramList();

        let mapUserOldCards = [];
        userPointTransferList.forEach(card => {
            rpList.forEach(rp => {
                //console.log(rp.royaltyProgramId,' : ', card.oldCardRoyaltyProgramId);
                if(rp.royaltyProgramId == card.oldCardRoyaltyProgramId.trim()){
                    let temp = Object.assign({
                        oldRoyaltyProgramName: rp.name,
                        oldRoyaltyProgramImg:rp.img,
                        oldRoyaltyProgramVendor: rp.vendor
                    },card);
                    mapUserOldCards.push(temp);
                    //console.log('temp: ',temp);
                }
            });
        });

        let mapUserNewCards = [];
        mapUserOldCards.forEach(card => {
            rpList.forEach(rp => {
                //console.log(rp.royaltyProgramId,' : ', card.oldCardRoyaltyProgramId);
                if(rp.royaltyProgramId == card.newCardRoyaltyProgramId.trim()){
                    let temp = Object.assign({
                        newRoyaltyProgramName: rp.name,
                        newRoyaltyProgramImg:rp.img,
                        newRoyaltyProgramVendor: rp.vendor
                    },card);
                    mapUserNewCards.push(temp);
                    //console.log('temp: ',temp);
                }
            });
        });

        return Promise.resolve(mapUserNewCards);

    } catch (e) {
        return Promise.reject(e);
    }
}


RoyaltyPromgramSchema.statics.getRoyaltyPromgramPointTransferByUser = async function (citizenId, rpId) {    
    try {
        let user = await composerUser.getUser(citizenId);
        if(user.length < 1){
            return Promise.resolve([]);
        }
        let userPointTransferList = await composerPoint.getUserPoinTransferHistoryByVendor(user.userId, rpId);
        //let cpCard = await composerCard.getCardHistory(userId,cardId);
        let rpList = await RoyaltyProgram.getRoyaltyPromgramList();

        let mapUserOldCards = [];
        userPointTransferList.forEach(card => {
            rpList.forEach(rp => {
                //console.log(rp.royaltyProgramId,' : ', card.oldCardRoyaltyProgramId);
                if(rp.royaltyProgramId == card.oldCardRoyaltyProgramId.trim()){
                    let temp = Object.assign({
                        oldRoyaltyProgramName: rp.name,
                        oldRoyaltyProgramImg:rp.img,
                        oldRoyaltyProgramVendor: rp.vendor
                    },card);
                    mapUserOldCards.push(temp);
                    //console.log('temp: ',temp);
                }
            });
        });

        let mapUserNewCards = [];
        mapUserOldCards.forEach(card => {
            rpList.forEach(rp => {
                //console.log(rp.royaltyProgramId,' : ', card.oldCardRoyaltyProgramId);
                if(rp.royaltyProgramId == card.newCardRoyaltyProgramId.trim()){
                    let temp = Object.assign({
                        newRoyaltyProgramName: rp.name,
                        newRoyaltyProgramImg:rp.img,
                        newRoyaltyProgramVendor: rp.vendor
                    },card);
                    mapUserNewCards.push(temp);
                    //console.log('temp: ',temp);
                }
            });
        });

        return Promise.resolve(mapUserNewCards);

    } catch (e) {
        return Promise.reject(e);
    }
}

var RoyaltyProgram = mongoose.model('RoyaltyProgram', RoyaltyPromgramSchema);

module.exports = {
    RoyaltyProgram
}


// RoyaltyPromgramSchema.statics.getRoyaltyPromgramPointTransferByUser = async function (citizenId, rpId) {
//     console.log('getRoyaltyPromgramPointTransferByUser');
//     let RoyaltyProgram = this;
//     try {
//         let user = await composerUser.getUser(citizenId);
//         if(user.length < 1){
//             return Promise.resolve([]);
//         }else{
//             let userPointTransferList = await getUserPoinTransferHistoryByVendor(user[0].userId, rpId);

//         }
//         return Promise.resolve(mappingRP);
//     } catch (e) {
//         return Promise.reject(e);
//     }
// }