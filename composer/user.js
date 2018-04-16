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

let addUser = async function (user) {

    console.log('AddUser transaction');
    console.log(user);
    try {
        await getConnection();
        let bnDef = this.connection.getBusinessNetwork();
        let factory = bnDef.getFactory();

        let userTrans = factory.newTransaction('org.dek.network', 'AddUser');
        userTrans.setPropertyValue('userId', uuid());
        userTrans.setPropertyValue('citizenId', user.citizenId);
        userTrans.setPropertyValue('firstname', user.firstname);
        userTrans.setPropertyValue('lastname', user.lastname);

        let transactionStatus = await this.connection.submitTransaction(userTrans);

        getDisconnection();

        return Promise.resolve(transactionStatus);
    } catch (e) {
        return Promise.reject(e);
    }
}

let getUser  = async function (citizenId){
    
    console.log('getUser function');
    citizenId = citizenId.toString();
    try{

        await getConnection();
        
        let statement = 'SELECT org.dek.network.User WHERE (citizenId == _$citizenId)';
        let userQuery = await this.connection.buildQuery(statement);
        let queriedUser = await this.connection.query( userQuery, { citizenId: citizenId });

        // console.log(queriedUser);
        await getDisconnection();
        if(queriedUser){
            return Promise.resolve(queriedUser);
        }else{
            return Promise.reject('no user match this citizenId');
        }


    }catch(e){
        await getDisconnection();
        return Promise.reject(e);
    }

}


async function testGetUser() {
    let user = await getUser('3091');
    console.log(user[0]);
}
