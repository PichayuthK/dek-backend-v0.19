var User = require('./user.js');
var Card = require('./card.js');


let generateSeed = async () => {
    try {
        await User.addUser({
            citizenId: '1111',
            firstname: 'Test111',
            lastname: 'kitti'
        });
        
        await Card.addCard({
            userId: '1',
            cardNumber: '1111-1111',
            point: '1000',
            royaltyProgramId: '1'
        });

        await Card.addCard({
            userId: '1',
            cardNumber: '2222-2222',
            point: '3000',
            royaltyProgramId: '2'
        });

    } catch (e) {
        console.log('error');
        console.log(e);
    }
}

generateSeed();