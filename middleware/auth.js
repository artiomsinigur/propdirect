const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Take token from header
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'secretkeyofpropDirect');
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }
        
        // Give to that router access to the user that we fetched from the DB
        req.user = user;
        req.token = token;
        
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate!' });
    }
}

module.exports = auth;