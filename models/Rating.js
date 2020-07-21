const mongoose = require('mongoose');

const Rating = mongoose.model('Rating', {
    vote: {
        type: Number,
        required: true,
        default: 0
    },
    raterId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    ratedId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = Rating;