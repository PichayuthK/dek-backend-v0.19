let mongoose = require('mongoose');

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
        if (existUser) {
            return existUser
        } else {
            return await newUser.save();
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
}

let User = mongoose.model('User', UserSchema);

module.exports = {
    User
};