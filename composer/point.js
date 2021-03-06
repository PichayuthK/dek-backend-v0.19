let Connection = require('./connection');
let uuid = require('uuid/v1');
let moment = require('moment');
let _ = require('lodash');

let composerCard = require('./card');
let RoyaltyProgram = require('./royaltyProgram');

let transferPoint = async function (info) {

    console.log('transaferPoint transaction');
    console.log(info);
    let connection = await Connection.getConnection();
    try {

        let bnDef = connection.getBusinessNetwork();
        let factory = bnDef.getFactory();

        let pointTrans = factory.newTransaction('org.dek.network', 'TransferPoint');
        pointTrans.setPropertyValue('userId', info.userId);
        pointTrans.setPropertyValue('fromCardId', info.fromCardId);
        pointTrans.setPropertyValue('fromPoint', info.fromPoint);
        pointTrans.setPropertyValue('toCardId', info.toCardId);
        pointTrans.setPropertyValue('toPoint', info.toPoint);

        await connection.submitTransaction(pointTrans);

        // make retrun format
        await Connection.getDisconnection();
        console.log('transfer completed');
        let transferInfo = {}
        let fromCard = await composerCard.getCardInfo(info.fromCardId);
	fromCard = fromCard[0];
        let toCard = await composerCard.getCardInfo(info.toCardId);
        toCard = toCard[0];
	transferInfo.fromPoint = info.fromPoint;
        transferInfo.toPoint = info.toPoint;
	//console.log(fromCard);
	console.log('b4-rp');
        let rpList = await RoyaltyProgram.getRoyaltyProgramList('a');
//	console.log(rpList);
            rpList.forEach(rp => {
                if(rp.royaltyProgramId == fromCard.royaltyProgramId.trim()){
                    let temp = Object.assign({
                        fromRoyaltyProgramName: rp.royaltyProgramName,
                        fromRoyaltyProgramPoint:fromCard.point,
			fromRoyaltyProgramCardNumber: fromCard.cardNumber,
                        fromRoyaltyProgramVendor: rp.vendorName
                    });
                    transferInfo.fromCard = (temp);
                }
                if(rp.royaltyProgramId == toCard.royaltyProgramId.trim()){
                    let temp = Object.assign({
                        toRoyaltyProgramName: rp.royaltyProgramName,
                        fromRoyaltyProgramPoint:toCard.point,
                        fromRoyaltyProgramCardNumber: toCard.cardNumber,
                        toRoyaltyProgramVendor: rp.vendorName
                    });
                    transferInfo.toCard = (temp);
                }
            });
       
	console.log(transferInfo);
        return Promise.resolve(transferInfo);
    } catch (e) {

        await Connection.getDisconnection();
        return Promise.reject(e);
    }
}

var getPoinTransferHistoryFromVendor = async function (royaltyProgramId) {
    console.log('getPoinTransferHistoryFromVendor function');
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
            return x.oldCardRoyaltyProgramId == royaltyProgramId;
        });
        var sortTemp = _.orderBy(cardHistoryList, ['dateTime'], ['desc']);
        console.log('composer getPoinTransferHistoryFromVendor ',sortTemp);
        return Promise.resolve(sortTemp);

    } catch (e) {
        await Connection.getDisconnection();
        return Promise.reject(e);
    }
}

var getPoinTransferHistoryToVendor = async function (royaltyProgramId) {
    console.log('getPoinTransferHistoryFromVendor function');
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
            return x.newCardRoyaltyProgramId == royaltyProgramId;
        });
        var sortTemp = _.orderBy(cardHistoryList, ['dateTime'], ['desc']);
        console.log('composer getPoinTransferHistoryFromVendor ',sortTemp);
        return Promise.resolve(sortTemp);

    } catch (e) {
        await Connection.getDisconnection();
        return Promise.reject(e);
    }
}

var getUserPoinTransferHistoryByVendor = async function (userId, royaltyProgramId) {
    console.log('getUserTransferHistory function');
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
            return x.userId == userId && x.oldCardRoyaltyProgramId == royaltyProgramId;
        });
        var sortTemp = _.orderBy(cardHistoryList, ['dateTime'], ['desc']);
        console.log('composer getUserTransferHistory ',sortTemp);
        return Promise.resolve(sortTemp);

    } catch (e) {
        await Connection.getDisconnection();
        return Promise.reject(e);
    }
}

module.exports = {
    transferPoint,
    getUserPoinTransferHistoryByVendor,
    getPoinTransferHistoryFromVendor,
    getPoinTransferHistoryToVendor
}
