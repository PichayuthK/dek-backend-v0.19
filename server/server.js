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

/** Royalty Program **/

app.get('/royal', async (req,res) => {
    res.send(await RoyaltyProgram.getRoyaltyPromgramList());
});

app.get('/royal/:name', async(req,res) => {
    let rpName = req.params.name;
    res.send(await RoyaltyProgram.getRoyaltyProgram(rpName));
});

app.post('/royal', async(req,res) => {
    const body = _.pick(req.body, ['name','img','vendor','termAndCondition']);
    console.log(body);
    try{
        res.send(await RoyaltyProgram.addRoyaltyProgram(body));
    }catch(e){
        res.status(404).send(e);
    }
});

/** Card **/

app.post('/card', async (req,res) => {
    const body = _.pick(req.body, ['userId','cardNumber','royaltyProgramId'])
});


app.listen(port, () => {
    console.log('Started on port ', port);
});