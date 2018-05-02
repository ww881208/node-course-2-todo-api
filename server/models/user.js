const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        type:String,
        required: true,
        trim:true,
        minlength: 1,
        unique:true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

//override toJSON method
UserSchema.methods.toJSON = function(){

    var user = this;
    var userObj = user.toObject();
    return _.pick(userObj, ['_id' ,'email']);

};

//define a new function
UserSchema.methods.generateAuthToken = function (){

    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
    user.tokens = user.tokens.concat([{token, access}]);

    return user.save().then(() => {
        return token;
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};