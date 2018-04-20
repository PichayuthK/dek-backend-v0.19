let uuid = require('uuid/v1');
let Connection = require('./connection');


let addUser = async function (user) {

    console.log('AddUser transaction');
    console.log(user);
    let connection = await Connection.getConnection();
    try {
        let checkUser = await getUser(user.citizenId);
        if(checkUser.length > 0){
            await Connection.getDisconnection();
            return Promise.resolve(false);
        }

        let connection = await Connection.getConnection();

        let bnDef = connection.getBusinessNetwork();
        let factory = bnDef.getFactory();

        let userTrans = factory.newTransaction('org.dek.network', 'AddUser');
        userTrans.setPropertyValue('userId', uuid());
        userTrans.setPropertyValue('citizenId', user.citizenId);
        userTrans.setPropertyValue('firstname', user.firstname);
        userTrans.setPropertyValue('lastname', user.lastname);

        await connection.submitTransaction(userTrans);

        await Connection.getDisconnection();

        console.log('completed AddUser transaction');
        return Promise.resolve(true);

    } catch (e) {
        await Connection.getDisconnection();
        return Promise.reject(e);
    }
}

let getUser  = async function (citizenId){
    
    console.log('getUser function');
    console.log(citizenId);
    citizenId = citizenId.toString();
    let connection = await Connection.getConnection();
    try{

        let statement = 'SELECT org.dek.network.User WHERE (citizenId == _$citizenId)';
        let userQuery = await connection.buildQuery(statement);
        let queriedUser = await connection.query( userQuery, { citizenId: citizenId });

        await Connection.getDisconnection();
        let myUser = queriedUser[0];
        if(myUser){
            return Promise.resolve({
                userId: myUser['userId'],
                citizenId: myUser['citizenId'],
                firstname: myUser['firstname'],
                lastname: myUser['lastname']
            });
        }else{
            return Promise.resolve({});
        }


    }catch(e){
        await Connection.getDisconnection();
        return Promise.reject(e);
    }

}

// async function testGetUser() {
//     let user = await getUser('3091');
//     console.log(user[0]);
// }

module.exports = {
    addUser,
    getUser
}