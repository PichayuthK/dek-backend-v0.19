let uuid = require('uuid/v1');
let Connection = require('./connection');

let addRoyaltyProgram = async function (info) {

    console.log('addRoyaltyProgram transaction');
    console.log(info);

    let connection = await Connection.getConnection();
    try {
        let checkCard = await checkExistingRoyaltyProgram(info.royaltyProgramName);

        if (checkCard) {
            await Connection.getDisconnection();
            return Promise.resolve(false);
        }

        let bnDef = connection.getBusinessNetwork();
        let factory = bnDef.getFactory();

        console.log('create transaction');
        let royalTrans = factory.newTransaction('org.dek.network', 'AddRoyaltyProgram');
        royalTrans.setPropertyValue('royaltyProgramId', uuid());
        royalTrans.setPropertyValue('royaltyProgramName', info.royaltyProgramName.toUpperCase());
        royalTrans.setPropertyValue('vendorName', info.vendorName.toUpperCase());

        await connection.submitTransaction(royalTrans);

        await Connection.getDisconnection();

        console.log('completed addRoyaltyProgram transaction\n');
        return Promise.resolve(true);

    } catch (e) {
        await Connection.getDisconnection();
        console.log('error addRoyaltyProgram');
        return Promise.reject(e);
    }
}

var checkExistingRoyaltyProgram = async function (royaltyProgramName) {
    console.log('Check exsinting card');
    let connection = await Connection.getConnection();
    try {

        var statement = 'SELECT  org.dek.network.RoyaltyProgram WHERE (royaltyProgramName == _$royaltyProgramName)';
        let cardQuery = await connection.buildQuery(statement);
        let querieCard = await connection.query(cardQuery, {
            royaltyProgramName: royaltyProgramName
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

var getRoyaltyProgramList = async function (royaltyProgramName) {
    console.log('Check exsinting card');
    let connection = await Connection.getConnection();
    try {

        var statement = 'SELECT  org.dek.network.RoyaltyProgram';
        let cardQuery = await connection.buildQuery(statement);
        let querieRP = await connection.query(cardQuery);

        await Connection.getDisconnection();
        //console.log(await querieRP);
        return Promise.resolve(await querieRP);

    } catch (e) {
        await Connection.getDisconnection();
        return Promise.reject(e);
    }

}

module.exports = {
    addRoyaltyProgram,
    getRoyaltyProgramList
}