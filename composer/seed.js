var User = require('./user.js');
var Card = require('./card.js');
var RoyaltyProgram = require('./royaltyProgram.js');
var Point = require('./point');

let generateSeed = async () => {
    try {
        // await User.addUser({
        //     citizenId: '1111',
        //     firstname: 'Test111',
        //     lastname: 'kitti'
        // });

        //    console.log(await User.getUser('3091'));

        // console.log(await Card.getUserAllCards('1'));

        // await Card.addCard({
        //     userId: '1',
        //     cardNumber: '1111-1111',
        //     point: '1000',
        //     royaltyProgramId: '1'
        // });

        // await Card.addCard({
        //     userId: '1',
        //     cardNumber: '2222-2222',
        //     point: '3000',
        //     royaltyProgramId: '2'
        // });

        // await RoyaltyProgram.addRoyaltyProgram({
        //     royaltyProgramName: 'BIG POINT',
        //     vendorName: 'AIR ASIA'
        // });


        // await Point.transferPoint({
        //     userId:'ab4cba80-4241-11e8-8290-1dad6b15c4f9',
        //     fromCardId:'0ef40990-4219-11e8-a844-35afedacc27a',
        //     fromPoint:'1',
        //     toCardId:'1bd44b70-421e-11e8-b8ce-6933d791e0c5',
        //     toPoint:'3',
        // });

        console.log(await Card.getCardHistory('ab4cba80-4241-11e8-8290-1dad6b15c4f9'
            ,'0ef40990-4219-11e8-a844-35afedacc27a'));

    } catch (e) {
        console.log('error');
        console.log(e);
    }
}

generateSeed();

   // let newUser = new User(body);
//     try {
//         let userResult = await newUser.save();
//         console.log(userResult);
//        res.send(await userResult);
//     } catch (e) {
//        res.status(404).send(e);
//    }