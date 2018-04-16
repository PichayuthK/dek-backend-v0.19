let cardStore = require('composer-common').FileSystemCardStore;
let businessNetworkConnection = require('composer-client').BusinessNetworkConnection;
let uuid = require('uuid/v1');

const cardName = 'admin@dek-network';
const cardType = {
    type: 'composer-wallet-filesystem'
};
let connection = {};

async function getConnection() {
    console.log('connection');
    this.connection = new businessNetworkConnection(cardType);
    let myConnection = await this.connection.connect(cardName);
}

async function getDisconnection() {
    console.log('disconnect');
    await this.connection.disconnect();
}

let transferPoint = async function (info){

    console.lof('transaferPoint transaction');
    try {
        await getConnection();
        let bnDef = this.connection.getBusinessNetwork();
        let factory = bnDef.getFactory();

        let pointTrans = factory.newTransaction('org.dek.network', 'TransferPoint');
        pointTrans.setPropertyValue('userId', uuid());
        pointTrans.setPropertyValue('fromCardId', info.fromCardId);
        pointTrans.setPropertyValue('fromPoint', info.fromPoint);
        pointTrans.setPropertyValue('toCardId', info.toCardId);
        pointTrans.setPropertyValue('toPoint', info.toPoint);

        let transactionStatus = await this.connection.submitTransaction(pointTrans);

        console.log(transactionStatus);
        getDisconnection();

        return Promise.resolve(transactionStatus);
    } catch (e) {
        return Promise.reject(e);
    }

}

transferPoint();