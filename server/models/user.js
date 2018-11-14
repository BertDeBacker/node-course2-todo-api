const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

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

//Add to methods will make this function an INSTANCE method
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

//Add to statics will make this function a MODULE method
UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123')

    } catch (error) {
        return Promise.reject()
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })

}

//Add a function before (pre) the SAVE event fires.  
//The function takes an argument next which must be 
// fired in the function, if not the app will crash!
UserSchema.pre('save', function(next) {
    var user = this
    if (user.isModified('password')) {
        //user.password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next()
            })
        })


        // bcrypt.genSalt(10, (err, salt) => {
        //     bcrypt.hash(password, salt, ((err, hash) => {
        //         console.log(hash)
        //     }))
        // })

    } else {
        next()
    }

})

var User = mongoose.model('User', UserSchema)

module.exports = { User }