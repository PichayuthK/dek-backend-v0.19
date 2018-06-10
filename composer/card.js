let uuid = require('uuid/v1');
let Connection = require('./connection');
let moment = require('moment');
let _ = require('lodash');

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

var getUserCard = async function (cardNumber) {
    console.log('getUserCard function');
    let connection = await Connection.getConnection();
    try {
        var statement = 'SELECT  org.dek.network.Card WHERE (cardNumber == _$cardNumber)';
        var cardQuery = await connection.buildQuery(statement);
        var queriedCards = await connection.query(cardQuery, {
            cardNumber: cardNumber
        });

        await Connection.getDisconnection();
        console.log(queriedCards);
        let userCards = [];
        queriedCards.forEach(e => {
            userCards.push({
                cardId: e.cardId,
                userId: e.userId,
                cardNumber: e.cardNumber,
                royaltyProgramId: e.royaltyProgramId,
                point: e.point
            });
        });
        console.log(userCards[0]);
        return Promise.resolve(userCards[0]);

    } catch (e) {
        console.log('error getUserCard');
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
        //console.log(queriedCards);
        let userCards = [];
        queriedCards.forEach(e => {
            userCards.push({
                cardId: e.cardId,
                userId: e.userId,
                cardNumber: e.cardNumber,
                royaltyProgramId: e.royaltyProgramId,
                point: e.point,
            });
        });
        return Promise.resolve(userCards);

    } catch (e) {
        await Connection.getDisconnection();
        return Promise.reject(e);
    }
}

var getUserRoyaltyProgramCard = async function (userId, rpId) {
    console.log('getUserRoyaltyProgramCard function');
    let connection = await Connection.getConnection();
    try {
        var statement = 'SELECT  org.dek.network.Card WHERE (userId == _$userId AND royaltyProgramId == _$royaltyProgramId)';
        var cardQuery = await connection.buildQuery(statement);
        var queriedCards = await connection.query(cardQuery, {
            userId: userId,
            royaltyProgramId: rpId
        });

        await Connection.getDisconnection();
        //console.log(queriedCards);
        let userCards = [];
        queriedCards.forEach(e => {
            userCards.push({
                cardId: e.cardId,
                userId: e.userId,
                cardNumber: e.cardNumber,
                royaltyProgramId: e.royaltyProgramId,
                point: e.point,
            });
        });
        return Promise.resolve(userCards);

    } catch (e) {
        await Connection.getDisconnection();
        return Promise.reject(e);
    }
}

var getCardHistory = async function (userId, cardId) {
    console.log('getCardHistory function');
    let connection = await Connection.getConnection();
    try {
        var statement = "SELECT org.hyperledger.composer.system.HistorianRecord WHERE (transactionType == 'org.dek.network.TransferPoint')"; 
        var cardQuery = await connection.buildQuery(statement);
        var queriedCards = await connection.query(cardQuery);

        await Connection.getDisconnection();

        var cardHistoryList = [];
        queriedCards.forEach((x) => {
            var item = x['eventsEmitted'][0];
            // console.log(item);
            if (item != null) {
                cardHistoryList.push({
                    userId: item['userId'],
                    oldCardId: item['oldCardId'],
                    updateCardId: item['newCardId'],
                    fromPoint: item['oldPoint'],
                    toPoint: item['newPoint'],
                    dateTime: new moment(item['timestamp']).format('YYYY-MM-DD HH:mm:ss'),
                    oldCardRoyaltyProgramId: item['oldCardRoyaltyProgramId'],
                    newCardRoyaltyProgramId: item['newCardRoyaltyProgramId']
                });
            }

        });

        cardHistoryList = cardHistoryList.filter((x) => {
            return x.userId == userId && x.oldCardId == cardId;
        });
        var sortTemp = _.orderBy(cardHistoryList, ['dateTime'], ['desc']);
        console.log('composer getCardHistory ',sortTemp);
        return Promise.resolve(sortTemp);

    } catch (e) {
        await Connection.getDisconnection();
        return Promise.reject(e);
    }
}

var getCardInfo = async function (cardId) {
    console.log('getUserRoyaltyProgramCard function');
    let connection = await Connection.getConnection();
    try {
        var statement = 'SELECT  org.dek.network.Card WHERE (cardId == _$cardId)';
        var cardQuery = await connection.buildQuery(statement);
        var queriedCards = await connection.query(cardQuery, {
            cardId:cardId
        });

        await Connection.getDisconnection();
       
        return Promise.resolve(queriedCards);

    } catch (e) {
        await Connection.getDisconnection();
        return Promise.reject(e);
    }
}

module.exports = {
    addCard,
    getUserAllCards,
    getCardHistory,
    getUserCard,
    getUserRoyaltyProgramCard,
    getCardInfo,
    
}

