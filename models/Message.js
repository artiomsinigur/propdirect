const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        trim: true,
        required: true,
        maxlength: [1000, 'Maximum 1000 characters allowed.'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Conversation'
    }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;