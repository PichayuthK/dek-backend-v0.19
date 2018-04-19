var mongoose = require('mongoose');
let composerCard = require('./../../composer/card');
let {
    RoyaltyProgram
} = require('./royaltyProgram');
let composerRoyaltyProgram = require('./../../composer/royaltyProgram');


let CardSchema = new mongoose.Schema({
    cardNumber:{
        type:String
    },
    royaltyProgramName:{
        type:String
    },
    point:{
        type: String
    }
});

CardSchema.statics.addCard = async function (card) {
   
    card.royaltyProgramName = card.royaltyProgramName.toUpperCase();
    let newCard = new this(card);
    try {
        let existCard = await this.getCard(card.cardNumber);      
        if (existCard) {
            return existCard
        } else {
            return await newCard.saveuserCards();
        }
    } catch (e) {
        return Promise.reject(e);
    }
};

CardSchema.statics.getCard = async function (cardNumber) {    
    let Card = this;
    try {
        return await Card.findOne({
            cardNumber: cardNumber
        });
    } catch (e) {
        return Promise.reject(e);
    }
}

CardSchema.statics.getCardByRoyaltyProgram = async function (userId, rpName) {    
    let Card = this;
    
    try {
        let composerRoyal = await composerRoyaltyProgram.getRoyaltyProgramByName(rpName);
        let userRPCardList = await composerCard.getUserRoyaltyProgramCard(userId, composerRoyal[0].royaltyProgramId);
        let royaltyName = await RoyaltyProgram.getRoyaltyPromgram(rpName);
        let mapUserCards = {
            royaltyProgramInfo: royaltyName,
            userCardlist: userRPCardList
        };
        return Promise.resolve(mapUserCards);

    } catch (e) {
        return Promise.reject(e);
    }
}

CardSchema.statics.getUserAllCards = async function (userId) {    
    let Card = this;
    try {
        let cpCard = await composerCard.getUserAllCards(userId);
        let rpList = await RoyaltyProgram.getRoyaltyPromgramList();
        console.log(cpCard,'\n');
        console.log(rpList);
        let mapUserCards = [];
        cpCard.forEach(card => {
            rpList.forEach(rp => {
                if(rp.royaltyProgramId == card.royaltyProgramId.trim()){
                    let temp = Object.assign({
                        royaltyProgramName: rp.name,
                        img:rp.img,
                        vendor: rp.vendor
                    },card);
                    mapUserCards.push(temp);
                }
            });
        });

        return Promise.resolve(mapUserCards);

    } catch (e) {
        return Promise.reject(e);
    }
}

CardSchema.statics.getCardHistory = async function (userId, cardId) {    
    let Card = this;
    try {
        let cpCard = await composerCard.getCardHistory(userId,cardId);
        let rpList = await RoyaltyProgram.getRoyaltyPromgramList();

        let mapUserOldCards = [];
        cpCard.forEach(card => {
            rpList.forEach(rp => {
                //console.log(rp.royaltyProgramId,' : ', card.oldCardRoyaltyProgramId);
                if(rp.royaltyProgramId == card.oldCardRoyaltyProgramId){
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
                if(rp.royaltyProgramId == card.newCardRoyaltyProgramId){
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

var Card = mongoose.model('Card', CardSchema);

module.exports = {
    Card
};