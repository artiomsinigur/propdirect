const express = require('express');
// const auth = require('../middleware/auth');
const router = express.Router();
const sharp = require('sharp');
const UserController = require('../controllers/user');
const PropertyController = require('../controllers/property');
const ChatController = require('../controllers/chat');
const RatingController = require('../controllers/rating');
const dashboardCustomerController = require('../controllers/dashboardCustomer');
const dashboardSellerController = require('../controllers/dashboardSeller');
const dashboardAdminController = require('../controllers/dashboardAdmin');
const ROLES = require('../helpers/roles');
const { checkRoles, upload, auth } = require('../helpers/utils');

// validationResult is a middleware
// const { check, validationResult } = require('express-validator');
// const validationRules = [
//     check('password').isLength({ min: 6 }),
//     check('email').isEmail(),
// ]

// Index page
router.get('/', PropertyController.getIndex);


// ========================//
// User
// ========================//
// Public
router.get('/login', UserController.loginForm);
router.get('/register', UserController.registerForm);
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Private
router.get('/logout', UserController.logout);
router.post('/logoutAll', auth, UserController.logoutAll);
router.get('/users/me', auth, UserController.findOwnProfile);
router.patch('/users/me', auth, UserController.updateUser);
router.delete('/users/me', auth, UserController.deleteUser);
/**
 * Upload avatar
 */
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // Resize file, convert format in jpg and save it in buffer type
    const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .jpeg()
    .toBuffer();
    req.user.avatar = buffer;

    // Store file in field model avatar
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(404).send({ error: error.message });
});
router.delete('/users/me/avatar', auth, UserController.deleteAvatar);
router.get('/users/:id/avatar', UserController.fetchAvatar);


// ========================//
// Property
// ========================//
// Private
router.get('/properties/create', auth, checkRoles(ROLES.Seller), PropertyController.createProperty);
router.post('/properties/store', auth, checkRoles(ROLES.Seller), PropertyController.storeProperty);
router.get('/properties/property/:id/interested', auth, checkRoles(ROLES.Customer), PropertyController.interestedProperty);
// Public
router.get('/properties/property/:id', PropertyController.findPropertyById);
router.get('/properties/search/list', PropertyController.searchByTerms);

// ========================//
// Chat
// ========================//
router.get('/chat', auth, ChatController.getConversation);
router.get('/chat/conversation/:id', auth, ChatController.getMessagesByConversation);
router.post('/chat/conversation/property/:idProperty/recipient/:idRecipient', auth, ChatController.createConversation);
router.post('/chat/conversation/:id', auth, ChatController.replayToConversation);


// ========================//
// Rating
// ========================//
router.post('/rate/:idProperty', auth, checkRoles(ROLES.Customer), RatingController.rateSeller);
router.get('/rate/:idSeller', RatingController.getAverageRate);


// ========================//
// Dashboard Customer
// ========================//
router.get('/dashboard-customer', auth, checkRoles(ROLES.Customer), dashboardCustomerController.getDashboardCustomer);
router.post('/dashboard-customer/delete/:id', auth, checkRoles(ROLES.Customer), dashboardCustomerController.deleteInterestedProperty);


// ========================//
// Dashboard Seller
// ========================//
router.get('/dashboard-seller', auth, checkRoles(ROLES.Seller), dashboardSellerController.getDashboardSeller)
router.get('/dashboard-seller/property/:id/edit', auth, checkRoles(ROLES.Seller), dashboardSellerController.editForm);
router.post('/dashboard-seller/property/update', auth, checkRoles(ROLES.Seller), dashboardSellerController.updateOwnProperty);
router.post('/dashboard-seller/delete/property/:id', auth, checkRoles(ROLES.Seller), dashboardSellerController.deleteOwnProperty);


// ========================//
// Dashboard Admin
// ========================//
router.get('/dashboard-admin', auth, checkRoles(ROLES.Admin), dashboardAdminController.getDashboardAdmin);
router.get('/dashboard-admin/users', auth, checkRoles(ROLES.Admin), dashboardAdminController.findUsers);
router.get('/dashboard-admin/user/:id', auth, checkRoles(ROLES.Admin), dashboardAdminController.banUserById);
router.patch('/dashboard-admin/user/:id', auth, checkRoles(ROLES.Admin), dashboardAdminController.updateUserById);
router.delete('/dashboard-admin/user/:id', auth, checkRoles(ROLES.Admin), dashboardAdminController.deleteUserById);

router.get('/dashboard-admin/properties', auth, checkRoles(ROLES.Admin), dashboardAdminController.findProperties);
router.get('/dashboard-admin/confirmed/property/:id', auth, checkRoles(ROLES.Admin), dashboardAdminController.confirmPropertyById);
router.patch('/dashboard-admin/property/:id', auth, checkRoles(ROLES.Admin), dashboardAdminController.updatePropertyById);
router.delete('/dashboard-admin/property/:id', auth, checkRoles(ROLES.Admin), dashboardAdminController.deletePropertyById);

// Setup a generic 404 page. 
// * match anything else that is not set in router
router.get('*', (req, res) => {
    if (req.user) {
        const { role } = req.user;

        return res.render('404.html', {
            error: 'Houston we have a problem!',
            role
        });
    }

    res.render('404.html', {
        error: 'Houston we have a problem!',
    });
});

module.exports = router;