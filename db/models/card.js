var mongoose = require('mongoose');
let composerCard = require('./../../composer/card');
let {
    RoyaltyProgram
} = require('./royaltyProgram');

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
            return await newCard.save();
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


CardSchema.statics.getUserAllCards = async function (userId) {    
    let Card = this;
    try {
        let cpCard = await composerCard.getUserAllCards(userId);
        let rpList = await RoyaltyProgram.getRoyaltyPromgramList();

        let mapUserCards = [];
        cpCard.forEach(card => {
            rpList.forEach(rp => {
                if(rp.royaltyProgramId == card.royaltyProgramId){
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

var Card = mongoose.model('Card', CardSchema);

module.exports = {
    Card
};