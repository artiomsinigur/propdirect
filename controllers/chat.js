const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

/**
 * Get conversations
 */
exports.getConversation = async (req, res) => {
    try {
        // Get conversation where this user participated
        const conversations = await Conversation.find({ participants: req.user._id }).select('_id');
        if (conversations.length === 0) {
            return res.status(404).send();
        }
        
        // Hold conversations
        let fullConversations = [];
        conversations.forEach((conversation) => {
            Message.find({ conversationId: conversation._id })
            .sort({createdAt: -1})
            .limit(1)
            .populate({ path: 'author', select: 'firstName lastName' })
            .exec((err, message) => {
                fullConversations.push(message);

                // when the fullConversations is equal in size to the length of the conversations, we are done
                if(fullConversations.length === conversations.length) {
                    res.send({ conversations: fullConversations });
                }
            });
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * Get all messages by conversation
 */
exports.getMessagesByConversation = async (req, res) => {
    try {
        const messages = await Message.find({ conversationId: req.params.id })
        .sort({ createdAt: -1 })
        .limit(10).select('content createdAt author')
        .populate({ path: 'author', select: 'firstName' });

        res.send(messages);
    } catch (error) {
        res.status(404).send(error);
    }
};

/**
 * Create new conversation
 */
exports.createConversation = async (req, res) => {
    try {
        // Check if a property or a recipient is selected
        if (!req.params.idProperty || !req.params.idRecipient) {
            return res.status(400).send({ error: 'Please choose a valid recipient or a property for your message.' });
        }

        // Check if message body is not empty
        if (!req.body.content) {
            return res.status(400).send({ error: 'Please enter a message.' });
        }

        // Start new conversation with a recipient
        const newConversation = new Conversation({ participants: [req.user._id, req.params.idRecipient], property: req.params.idProperty });
        await newConversation.save();

        // Create message
        const newMessage = new Message({
            ...req.body,
            author: req.user._id,
            conversationId: newConversation._id
        });
        await newMessage.save();

        res.status(201).send(newMessage);
    } catch (error) {
        res.status(404).send(error);
    }
};

/** 
 * Replay to a conversation with id of conversation
 */
exports.replayToConversation = async (req, res) => {
    try {
        const message = new Message({
            ...req.body,
            author: req.user._id,
            conversationId: req.params.id
        });
        await message.save();

        res.status(201).send(message);
    } catch (error) {
        res.status(404).send(error);
    }
};

// module.exports = router;