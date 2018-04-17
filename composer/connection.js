let cardStore = require('composer-common').FileSystemCardStore;
let businessNetworkConnection = require('composer-client').BusinessNetworkConnection;
let uuid = require('uuid/v1');

const cardName = 'admin@dek-network';
const cardType = {
    type: 'composer-wallet-filesystem'
};
let connection = {};

let getConnection = async function () {
    console.log('connection');
    this.connection = new businessNetworkConnection(cardType);
    await this.connection.connect(cardName);
    return this.connection;
}

let getDisconnection =async function () {
    console.log('disconnect');
    await this.connection.disconnect();
}

module.exports = {
    getConnection,
    getDisconnection
}