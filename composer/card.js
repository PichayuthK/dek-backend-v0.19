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
    //console.log(myConnection);
    //await testDisconnection();
}

async function getDisconnection() {
    console.log('disconnect');
    await this.connection.disconnect();
}

let addCard = async function (info) {

    console.log('AddCard transaction');
    console.log(info);
    try {
        await getConnection();
        let bnDef = this.connection.getBusinessNetwork();
        let factory = bnDef.getFactory();

        let cardTrans = factory.newTransaction('org.dek.network', 'AddCard');
        cardTrans.setPropertyValue('cardId', uuid());
        cardTrans.setPropertyValue('userId', info.userId);
        cardTrans.setPropertyValue('cardNumber', info.cardNumber);
        cardTrans.setPropertyValue('point', info.point);
        cardTrans.setPropertyValue('royaltyProgramId', info.royaltyProgramId);

        let transactionStatus = await this.connection.submitTransaction(cardTrans);
        console.log(transactionStatus);
        getDisconnection();

        return Promise.resolve(transactionStatus);
    } catch (e) {
        return Promise.reject(e);
    }
}

addCard({
    userId: '1',
    cardNumber: '1111-1111',
    point:'1000',
    royaltyProgramId: '1'
});