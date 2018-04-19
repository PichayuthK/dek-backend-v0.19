let mongoose = require('mongoose');
let _ = require('lodash');
let composerUser = require('./../../composer/user');

let UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    citizenId: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    }
});

// UserSchema.statics.findByCredentials = async function (username, password) {
//     return true;
// };

UserSchema.statics.createUser = async function (user) {
    let newUser = new this(user);
    try {
        let existUser = await this.getUser(user.citizenId);    
        let existComposerUser = await composerUser.getUser(user.citizenId);  
        console.log(existUser,'\n');
        console.log(existComposerUser);
        if (existUser && !(_.isEmpty(existComposerUser))) {
            return existUser
        } else {
            if(!existUser){
                await newUser.save();
            }
            if(!(_.isEmpty(existComposerUser))){
                return await existComposerUser;
            }else{
                return await composerUser.addUser(_.pick(user, ['firstname','lastname','citizenId']));
            }
        }
    } catch (e) {
        return Promise.reject(e);
    }
};

UserSchema.statics.getUser = async function (citizenId) {    
    let User = this;
    try {
        return await User.findOne({
            citizenId: citizenId
        });
    } catch (e) {
        return Promise.reject(e);
    }
};

UserSchema.statics.checkUserCredential = async function ({username, password}) {    
    let User = this;
    try {
        let userResult = await User.findOne({ username: username, password: password });
        if(userResult){
            return await composerUser.getUser(userResult.citizenId);
        }else{
            return {};
        }
    } catch (e) {
        return Promise.reject(e);
    }
};

let User = mongoose.model('User', UserSchema);

module.exports = {
    User
};