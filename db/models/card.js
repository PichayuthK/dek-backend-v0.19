var mongoose = require('mongoose');

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

var Card = mongoose.model('Card', CardSchema);

module.exports = {
    Card
};