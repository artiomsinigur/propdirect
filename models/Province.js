const mongoose = require('mongoose');

const Province = mongoose.model('Province', {
    title: {
        type: String,
        trim: true,
        minlength: [3, 'Minimum 3 characters required.'],
        maxlength: [30, 'Maximum 70 characters allowed.'],
    }
})

module.exports = Province;