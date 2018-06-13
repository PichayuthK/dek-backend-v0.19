let uuid = require('uuid/v1');
let Connection = require('./connection');


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
                // cardHistoryList.push({
                //     userId: item['userId'],
                //     oldCardId: item['oldCardId'],
                //     updateCardId: item['newCardId'],
                //     fromPoint: item['oldPoint'],
                //     toPoint: item['newPoint'],
                //     dateTime: new moment(item['timestamp']).format('YYYY-MM-DD HH:mm:ss'),
                //     oldCardRoyaltyProgramId: item['oldCardRoyaltyProgramId'],
                //     newCardRoyaltyProgramId: item['newCardRoyaltyProgramId']
                // });

                let temp = Object.assign({
                    dateTime: new moment(item['timestamp']).format('YYYY-MM-DD HH:mm:ss')
                },x);
                cardHistoryList.push(temp);
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