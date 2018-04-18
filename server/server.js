const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

let {
    User
} = require('./../db/models/user');
let {
    mongoose
} = require('./../db/mongoose');
let {
    RoyaltyProgram
} = require('./../db/models/royaltyProgram');
let {
    Card
} = require('./../db/models/card');


let composerCard = require('./../composer/card');
let composerRoyaltyProgram = require('./../composer/royaltyProgram');

let app = express();

app.use(bodyParser.json());
const port = 3333;


app.get('/', (req, res) => {
    res.send('Welcome to Dek project');
});

/** User **/
app.get('/user/:citizenId', async (req,res) =>{
    let citizenId = req.params.citizenId;
    res.send(await User.getUser(citizenId));
});

app.post('/user', async (req, res) => {
    const body = _.pick(req.body, ['username', 'password', 'citizenId', 'firstname', 'lastname'])
    try {
        res.send(await User.createUser(body));
    } catch (e) {
        res.status(404).send(e);
    }
});

app.post('/login/user', async (req, res) => {
    const body = _.pick(req.body, ['username', 'password']);
    console.log(body);
    try {
        let userResullt = await User.checkUserCredential(body);
        if(userResullt) {
            res.send(userResullt);
        }else{
            res.status(401).send('Wrong username or password');
        }
   } catch (e) {
       res.status(404).send(e);
   }
});

/** Royalty Program **/

app.get('/royal', async (req,res) => {
    res.send(await RoyaltyProgram.getRoyaltyPromgramList());
});

app.get('/royal/:name', async(req,res) => {
    let rpName = req.params.name;
    res.send(await RoyaltyProgram.getRoyaltyProgram(rpName));
});

/** Card **/

app.get('/card/:userId', async (req,res) => {
    let userId = req.params.userId;
    try{
        res.send(await Card.getUserAllCards(userId));
    }catch(e){
        res.status(404).send(e);
    }
});

app.post('/card', async (req,res) => {
    const body = _.pick(req.body, ['userId','cardNumber','royaltyProgramId','userId']);
    console.log(body);
    try{
        let existingCard = await composerCard.getUserCard(body.cardNumber);
        console.log(`existingCard: ${existingCard}`);
        if(existingCard){
            res.send(existingCard);
        }else{
            let cardInfo = await Card.getCard(body.cardNumber);
            let newCard = await composerCard.addCard({
                userId:body.userId,
                cardNumber:body.cardNumber,
                point:cardInfo.point,
                royaltyProgramId:body.royaltyProgramId
            });
            if(newCard){
                res.send('Card added');
            }else{
                res.send('Unable to add card');
            }
        }

   }catch(e){
       res.status(404).send(e);
   }

});



 /** INIT **/
 app.post('/init/card', async (req,res) => {
    const body = _.pick(req.body, ['cardNumber','royaltyProgramName','point']);
    console.log(body);
    try{  
        res.send(await Card.addCard(body));
    }catch(e){
        res.status(404).send(e);
    }
});

app.post('/init/composer/royaltyProgram', async (req,res) => {
    const body = _.pick(req.body, ['royaltyProgramName','vendorName']);
    try{
        res.send(await composerRoyaltyProgram.addRoyaltyProgram(body));
    }catch(e){
        res.status(404).send(e);
    }
});

app.post('/init/royal', async(req,res) => {
    const body = _.pick(req.body, ['name','img','vendor','termAndCondition']);
    console.log(body);
    try{
        res.send(await RoyaltyProgram.addRoyaltyProgram(body));
    }catch(e){
        res.status(404).send(e);
    }
});

app.listen(port, () => {
    console.log('Started on port ', port);
});