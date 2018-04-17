let uuid = require('uuid/v1');
let Connection = require('./connection');

let addCard = async function (info) {

    console.log('AddCard transaction');
    console.log(info);

    let connection = await Connection.getConnection();
    try {
        let checkCard = await checkExistingCard(info.cardNumber);

        if (checkCard) {
            await Connection.getDisconnection();
            return Promise.resolve(false);
        }

        let bnDef = connection.getBusinessNetwork();
        let factory = bnDef.getFactory();

        console.log('create transaction');
        let cardTrans = factory.newTransaction('org.dek.network', 'AddCard');
        cardTrans.setPropertyValue('cardId', uuid());
        cardTrans.setPropertyValue('userId', info.userId);
        cardTrans.setPropertyValue('cardNumber', info.cardNumber);
        cardTrans.setPropertyValue('point', info.point);
        cardTrans.setPropertyValue('royaltyProgramId', info.royaltyProgramId);

        await connection.submitTransaction(cardTrans);

        await Connection.getDisconnection();

        console.log('completed AddCard transaction\n');
        return Promise.resolve(true);

    } catch (e) {
        await Connection.getDisconnection();
        console.log('error addCard');
        return Promise.reject(e);
    }
}

var checkExistingCard = async function (cardNumber) {
    console.log('Check exsinting card');
    let connection = await Connection.getConnection();
    try {

        var statement = 'SELECT  org.dek.network.Card WHERE (cardNumber == _$cardNumber)';
        let cardQuery = await connection.buildQuery(statement);
        let querieCard = await connection.query(cardQuery, {
            cardNumber: cardNumber
        });

        await Connection.getDisconnection();
        if (querieCard.length > 0) {
            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }


    } catch (e) {
        await Connection.getDisconnection();
        return Promise.reject(e);
    }

}

var getUserAllCards = async function (userId) {
    console.log('getUserAllCard function');
    let connection = await Connection.getConnection();
    try {
        var statement = 'SELECT  org.dek.network.Card WHERE (userId == _$userId)';
        var cardQuery = await connection.buildQuery(statement);
        var queriedCards = await connection.query(cardQuery, {
            userId: userId
        });

        await Connection.getDisconnection();
        console.log(queriedCards);
        return await queriedCards;

    } catch (e) {
        await Connection.getDisconnection();
        return Promise.reject(e);
    }
}

module.exports = {
    addCard,
    getUserAllCards
}

// addCard({
//     userId: '1',
//     cardNumber: '1111-1111',
//     point: '1000',
//     royaltyProgramId: '1'
// });