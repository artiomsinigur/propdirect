const Property = require('../models/Property');
const User = require('../models/User');

/**
 * Get admin dashboard
 */
exports.getDashboardAdmin = async (req, res) => {
    try {
        res.render('admin/dashboard-admin.html', {
            role: req.user.role,
        });
    } catch (error) {
        res.status(500).send()
    }
}


//=================================//P
// User
//=================================//
/**
 * Find users
 */
exports.findUsers = async (req, res) => {
    try {
        const users = await User.find({
            role: {
                $ne: 'Admin'
            } 
        })
        .sort({ createdAt: -1, banned: 1 })
        .limit(10)
        .select('email firstName createdAt role banned');

        // If no users found
        if (users.length === 0) {
            return res.status(404).send({ error: 'No users found.' });
        }

        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * Ban user by id
 */
exports.banUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('banned');
        
        if (user.banned) {
            await User.findByIdAndUpdate(req.params.id, { banned: false });
        } else {
            await User.findByIdAndUpdate(req.params.id, { banned: true });
        }

        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * Update user by id
 */
exports.updateUserById = async (req, res) => {
    // Allowed fields to be updated
    const keysUpdate = Object.keys(req.body);
    const allowedFields = ['firstName', 'lastName', 'phone'];
    const isValidFields = keysUpdate.every(key => allowedFields.includes(key));
    
    if (!isValidFields) {
        return res.status(400).send({ error: 'Invalid updates!'});
    }
    
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * Delete user by id
 */
exports.deleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};


//=================================//
// Property
//=================================//
/**
 * Find properties
 */
exports.findProperties = async (req, res) => {
    try {
        const properties = await Property.find({})
        .sort({ createdAt: -1})
        .limit(10)
        .select('title price createdAt confirmed')
        .populate({ path: 'owner', select: 'firstName' });

        // If no properties found
        if (properties.length === 0) {
            return res.status(404).send({ error: 'No properties found.' });
        }

        res.send(properties);
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * Confirm property by id
 */
exports.confirmPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).select('confirmed');
        
        if (property.confirmed) {
            await Property.findByIdAndUpdate(req.params.id, { confirmed: false });
        } else {
            await Property.findByIdAndUpdate(req.params.id, { confirmed: true });
        }

        // const property = await Property.findByIdAndUpdate(req.params.id, { confirmed: req.params.confirmed === 'true' });

        res.send(property);
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * Update property by id
 */
exports.updatePropertyById = async (req, res) => {
    // Allowed fields to be updated
    const keysUpdate = Object.keys(req.body);
    const allowedFields = ['title', 'price', 'description'];
    const isValidFields = keysUpdate.every(key => allowedFields.includes(key));
    
    if (!isValidFields) {
        return res.status(400).send({ error: 'Invalid updates!'});
    }
    
    try {
        const property = await Property.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        res.send(property);
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * Delete property by id
 */
exports.deletePropertyById = async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) {
            return res.status(404).send();
        }

        res.send(property);
    } catch (error) {
        res.status(500).send(error);
    }
};