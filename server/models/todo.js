var mongoose = require('mongoose')

//define Todo model
var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlenght: 1,
        trim: true //removes leading/trailing spacas
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
})

module.exports = { Todo }