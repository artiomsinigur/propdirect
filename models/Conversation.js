const mongoose = require('mongoose');

const Conversation = mongoose.model('Conversation', {
    participants: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }],
    property: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Property'
    }
})

module.exports = Conversation;