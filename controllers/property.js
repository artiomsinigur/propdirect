const Property = require('../models/Property');
const Message = require('../models/Message');
const Type = require('../models/Type');
const validateProperty = require('../helpers/validators');

/**
 * Get index page
 */
exports.getIndex = async (req, res) => {
    const types = await Type.find({});

    // If anyone is connected
    if (req.user) {
        const { role } = req.user;

        // If admin is connected, redirect him directly to admin dashboard
        if (role === 'Admin') {
            return res.redirect('/dashboard-admin');
        }

        // Otherwise, display index page for current user 
        return res.render('index.html', { role, types });
    }

    res.render('index.html', { types });
}

/**
 * Get property form
 */
exports.createProperty = async (req, res) => {
    try {
        const types = await Type.find({});
        res.render('./seller/store.html', {
            role: req.user.role, 
            types
        });
    } catch (error) {
        res.status(500).send(error);
    }
}

/**
 * Store new property
 */
exports.storeProperty = async (req, res) => {
    try {
        const property = new Property({
            ...req.body,
            owner: req.user._id,
        });
        await property.save();
        req.flash('successMsg', 'Operation effectuée avec succes.');
        res.redirect('/');
    } catch (error) {
        const types = await Type.find({});
        const errors = validateProperty(error);

        res.render('./seller/store.html', {
            errors, 
            types,
            role: req.user.role,
            title: req.body.title,
            price: req.body.price,
            selectedType: req.body.type,
            bedroom: req.body.bedroom,
            bathroom: req.body.bathroom,
            yearConstruction: req.body.yearConstruction,
            number: req.body.number,
            street: req.body.street,
            postalCode: req.body.postalCode,
            description: req.body.description,
        });
    }
};

/**
 * Find a property by id
 */
exports.findPropertyById = async (req, res) => {
    try {
        // Get property's messages
        const messages = await Message.find({ property: req.params.id });

        // Find property
        const property = await Property.findById(req.params.id)
        .populate({ path: 'type', select: 'title' })
        .populate({ path: 'owner', select: 'firstName' });

        // Display rating
        
        if (!property) {
            // return res.status(404).send();
            req.flash('errorMsg', 'No resources found.');
            return res.redirect('/properties/search/list');
        }

        // If user is connected, display navbar based on role or navbar for anonymous users 
        let role;
        if (req.user) {
            role = req.user.role;
        } else {
            role = null;
        }

        res.render('property-details.html', {
            role,
            property
        });
        // res.send({ property, messages });
    } catch (error) {
        // res.status(500).send(error);
        req.flash('errorMsg', 'Something goes wrong try later');
        res.redirect('/');
    }
};

/**
 * Find properties by terms
 */
// Ex. get /properties/search/list?title=maison&max_price=425000&type=4&sort=-created_at
exports.searchByTerms = async (req, res) => {
    let title = req.query.title || null;
    const type = req.query.type || null;
    if (type === null && title === null) {
        title = '';
    }
    const minPrice = req.query.min_price || 0;
    const maxPrice = req.query.max_price || 1000000000;
    const bedroom = req.query.bedroom || null;
    const bathroom = req.query.bathroom || null;
    
    try {
        const types = await Type.find({});
        const properties = await Property.find({
                price: {
                        $gte: minPrice,
                        $lte: maxPrice
                    },
                $or: [
                    {
                        title: {
                            $regex: new RegExp(title ,'i')
                        }
                    },
                    { type: type },
                    { bedroom: bedroom },
                    { bathroom: bathroom }
                ]}
            )
            .sort({price: -1})
            .limit(10)
            .populate({ path: 'type', select: 'title' })

            // If user is connected, display navbar based on role or navbar for anonymous users 
            let role;
            if (req.user) {
                role = req.user.role;
            } else {
                role = null;
            }

            if (properties.length === 0) {
                // return res.status(404).send({ error: 'No properties founded. Please try another term.'});
                return res.render('list.html', {
                    role,
                    types,
                    error: 'No properties founded. Please try another term.'
                })
            }

        res.render('list.html', {
            role,
            types,
            properties,
        })
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * For customer: Add an interested property
 */
exports.interestedProperty = async (req, res) => {
    try {
        const propertyId = req.params.id;
        const interestedProperties = req.user.interested;

        // Optional. Need to check if the property id exist on DB because it's possible to add non existing id
        const property = await Property.findById(propertyId);
        if (!property) {
            req.flash('errorMsg', 'Resource not found.');
            return res.redirect('/');
        }

        // If interested property already included, forbid access  
        const included = interestedProperties.includes(propertyId);
        if (included) {
            // return res.status(400).send();
            req.flash('errorMsg', 'You are already interested on this property');
            return res.redirect('back');
        }

        // Otherwise, store the property id
        req.user.interested.push(propertyId);
        await req.user.save();
        
        req.flash('successMsg', 'You added this property successfully. Now you can send a message to the owner.');
        res.redirect('back');
        // res.send(req.user.interested);
    } catch (error) {
        // res.status(500).send(error);
        req.flash('errorMsg', 'Access denied.');
        res.redirect('/');
    }
};