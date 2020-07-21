const Property = require('../models/Property');
const Type = require('../models/Type');
const validateProperty = require('../helpers/validators');

/**
 * Get seller dashboard
 */
exports.getDashboardSeller = async (req, res) => {
    // Fetch owner's properties
    const properties = await findOwnProperties(req, res);
    res.render('seller/dashboard-seller.html', {
        role: req.user.role, 
        firstName: req.user.firstName,
        properties
    });
}

/**
 * Find owner's properties
 */
const findOwnProperties = async (req, res) => {
    try {
        const properties = await Property.find({ owner: req.user._id })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('title price bedroom bathroom createdAt confirmed');

        return properties;
    } catch (error) {
        return error;
    }
};

/**
 * Get form to edit property by id
 */
exports.editForm = async (req, res) => {
    try {
        const types = await Type.find({});
        const property = await Property.findById(req.params.id);

        if (!property) {
            req.flash('errorMsg', 'Access denied or resource not found.');
            return res.redirect('/');
        }
        const { _id, type, title, price, description, street, postalCode, bedroom, bathroom, yearConstruction } = property;

        res.render('seller/update.html', {
            role: req.user.role,
            types,
            id: _id, selectedType: type, title, price, description, street, postalCode, bedroom, bathroom, yearConstruction
        });
    } catch (error) {
        req.flash('errorMsg', 'Resource not found.');
        return res.redirect('/dashboard-seller');
    }
}

/**
 * Update own property
 */
exports.updateOwnProperty = async (req, res) => {
    try {
        const property = await Property.findOneAndUpdate({ _id: req.body.id, owner: req.user._id}, req.body, { new: true, runValidators: true });
        if (!property) {
            req.flash('errorMsg', 'Resource not found.');
            return res.redirect('/dashboard-seller');
        }

        req.flash('successMsg', 'Mise à jour effectuée avec succes.');
        res.redirect('/dashboard-seller');
    } catch (error) {
        const types = await Type.find({});
        const errors = validateProperty(error);

        res.render('seller/update.html', {
            errors,
            types,
            id: req.body.id,
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
        })
    }
};

/**
 * Delete own property
 */
exports.deleteOwnProperty = async (req, res) => {
    try {
        const property = await Property.findOneAndDelete({ _id: req.params.id, owner: req.user._id});
        if (!property) {
            req.flash('errorMsg', 'Resource not found.');
            return res.redirect('/dashboard-seller');
        }

        req.flash('successMsg', 'Suppression effectuée avec succes.');
        res.redirect('/dashboard-seller');
    } catch (error) {
        req.flash('errorMsg', 'No resources found.');
        res.redirect('/dashboard-seller');
    }
};