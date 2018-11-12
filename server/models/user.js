const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlenght: 1,
        unique: true,
        trim: true,
        minlenght: 1,
        validate: {
            validator: validator.isEmail,
            message: `is gewoon een stop email adres da nog niet eens juist is.`
        }
    },
    password: {
        type: String,
        require: true,
        minlenght: 6
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
})

UserSchema.methods.toJSON = function() {
    var user = this
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email'])
};

UserSchema.methods.generateAuthToken = function() {
    //Note; arrow functions do not bind this to this file!! Therefore we need to use old function syntax here.    
    //UserSchema.methods.generateAuthToken = () => {

    var user = this;
    var access = 'auth'
    var token = jwt.sign({ _id: user._id, access }, 'abc123').toString()

    //user.tokens = user.tokens.concat([{ access, token }])
    user.tokens.push({ access, token })

    return user.save().then(() => {
        return token
    })
}

var User = mongoose.model('User', UserSchema)

module.exports = { User }