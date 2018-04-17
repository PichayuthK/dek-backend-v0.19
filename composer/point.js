let Connection = require('./connection');
let uuid = require('uuid/v1');


let transferPoint = async function (info) {

    console.log('transaferPoint transaction');
    let connection = await Connection.getConnection();
    try {

        let bnDef = connection.getBusinessNetwork();
        let factory = bnDef.getFactory();

        let pointTrans = factory.newTransaction('org.dek.network', 'TransferPoint');
        pointTrans.setPropertyValue('userId', uuid());
        pointTrans.setPropertyValue('fromCardId', info.fromCardId);
        pointTrans.setPropertyValue('fromPoint', info.fromPoint);
        pointTrans.setPropertyValue('toCardId', info.toCardId);
        pointTrans.setPropertyValue('toPoint', info.toPoint);

        await connection.submitTransaction(pointTrans);

        await Connection.getDisconnection();

        return Promise.resolve(true);
    } catch (e) {

        await Connection.getDisconnection();
        return Promise.reject(e);
    }

}

module.exports = {
    transferPoint
}