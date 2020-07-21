const Property = require('../models/Property');

/**
 * Get user's dashboard
 */
exports.getDashboardCustomer = async (req, res) => {
    const properties = await findInterestedProperties(req, res);

    // if (properties.length === 0) {
    //     req.flash('errorMsg', 'No resources found.');
    //     return res.render('/dashboard-customer');
    // }

    res.render('customer/dashboard-customer.html', { 
        role: req.user.role, 
        firstName: req.user.firstName,
        properties 
    });
}

/**
 * Find customer's interested properties
 */
const findInterestedProperties = async (req, res) => {
    try {
        const properties = await Property.find({ _id: req.user.interested })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('title price bedroom')
        .populate({ path: 'owner', select: 'firstName' });
    
        return properties;
    } catch (error) {
        return false;
    }
};

/**
 * Delete interested property id
 */
exports.deleteInterestedProperty = async (req, res) => {
    try {
        const propertyId = req.params.id;
        const interestedProperties = req.user.interested;

        const foundedIndex = interestedProperties.findIndex(id => String(id) === propertyId);
        req.user.interested.splice(foundedIndex, 1);
        await req.user.save();

        req.flash('successMsg', 'Suppression effectuée avec succes.');
        res.redirect('/dashboard-customer');
    } catch (error) {
        req.flash('errorMsg', 'No resources found.');
        res.redirect('/dashboard-customer');
    }
};