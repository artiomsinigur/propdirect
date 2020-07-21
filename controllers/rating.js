const User = require('../models/User');
const Rating = require('../models/Rating');
const Property = require('../models/Property');

/**
 * Rate an seller by property id
 */
exports.rateSeller = async (req, res) => {
    try {
        const ownerProperty = await Property.findById(req.params.idProperty).select('owner');
        const ratedBefore = await Rating.find({ raterId: req.user._id, ratedId: ownerProperty.owner });
        
        //  If rater not rate yet then insert new rate-document to Rating collection and update User rateValue array, otherwise, user is not allowed to rate
        if (ratedBefore.length !== 0) {
            return res.status(401).send();
        }
        // Store new rate
        const rate = {
            vote: req.body.vote,
            raterId: req.user._id,
            ratedId: ownerProperty.owner
        }
        const rating = new Rating(rate);
        await rating.save();
        
        // Update rate to Seller
        await User.findByIdAndUpdate(ownerProperty.owner, {$inc: {"rating.rateValue": req.body.vote, "rating.rateCount": 1}});
        
        res.send();
    } catch (error) {
        res.status(404).send(error);
    }
};

/**
 * Get average rating for seller by seller id
 */
exports.getAverageRate = async (req, res) => {
    try {
        const user = await User.findById(req.params.idSeller).select('rating');
        const average = (user.rating.rateValue / user.rating.rateCount).toFixed(1);
        
        res.send({rateAverage: Number(average), reviews: user.rating.rateCount});
    } catch (error) {
        res.status(500).send(error);
    }
};