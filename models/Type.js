const mongoose = require('mongoose');

const Type = mongoose.model('Type', {
    title: {
        type: String,
        required: ['Type required.'],
        trim: true,
        minlength: [3, 'Minimum 3 characters required.'],
        maxlength: [70, 'Maximum 70 characters allowed.'],
    }
})

module.exports = Type;