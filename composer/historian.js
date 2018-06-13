let uuid = require('uuid/v1');
let Connection = require('./connection');
let moment = require('moment');
let _ = require('lodash');

var getAllHistorian = async function () {
    console.log('getAllHistorian function');
    let connection = await Connection.getConnection();
    try {
        var statement = "SELECT org.hyperledger.composer.system.HistorianRecord"; 
        var cardQuery = await connection.buildQuery(statement);
        var queriedCards = await connection.query(cardQuery);

        await Connection.getDisconnection();

        var cardHistoryList = [];
        console.log('queriedCards => ',queriedCards);
        let count = -1;
        queriedCards.forEach((x) => {
            if(count === 0){
                console.log(x);
                count += 1;
            }
            // var item = x['eventsEmitted'][0];
            // console.log(item);
            // if (item != null) {
                cardHistoryList.push({
                    class: x['$class'],
                    transactionId: x['transactionId'],
                    transactionType: x['transactionType'],
                    transactionInvoked: x['transactionInvoked'],
                    participantInvoking: x['participantInvoking'],
                    dateTime: new moment(x['transactionTimestamp']).format('YYYY-MM-DD HH:mm:ss'),
                    identityUsed: x['identityUsed'],
                });

                // let temp = Object.assign({
                //     dateTime: new moment(x['transactionTimestamp']).format('YYYY-MM-DD HH:mm:ss')
                // },x);
                // cardHistoryList.push(temp);
            // }

        });

        var sortTemp = _.orderBy(cardHistoryList, ['dateTime'], ['desc']);
        console.log('composer getAllHistorian ',sortTemp);
        return Promise.resolve(sortTemp);

    } catch (e) {
        await Connection.getDisconnection();
        return Promise.reject(e);
    }
}


module.exports = {
    getAllHistorian
}