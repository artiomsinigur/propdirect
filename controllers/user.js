const express = require('express');
const User = require('../models/User');
const sharp = require('sharp');
const { validationResult } = require('express-validator');
const passport = require('passport');

/**
 * Get login form
 */
exports.loginForm = async (req, res) => {
    if (req.user) {
        req.flash('errorMsg', 'You are already logged.');
        return res.redirect('/');
    }
    res.render('login.html');
}

/**
 * Get register form
 */
exports.registerForm = async (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('register.html')
}

/**
 * Register: Store new user
 */
exports.register = async (req, res) => {
    const userFiels = {
        email: req.body.email,
        role: req.body.role,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
    }
    const user = new User(req.body);
    try {
        // const token = await user.generateAuthToken();
        await user.save();
        // res.status(201).send({ user });

        req.flash('successMsg', 'Vous êtes inscrit avec succès! Veuillez vous connecter.');
        res.redirect('/login');
    } catch (error) {
        const { email, password, role, phone } = error.errors;
        let errors = [];
        
        // Validate email
        if (email) {
            errors.push(email.message);
        }

        // Validate password
        if (password) {
            errors.push(password.message);
        }

        // Validate role
        if (role) {
            errors.push(role.message);
        }

        // Validate role
        if (phone) {
            errors.push(phone.message);
        }

        // res.status(400).send(errors);
        res.status(401).render('register.html', { 
            errors,
            email: userFiels.email,
            role: userFiels.role,
            firstName: userFiels.firstName,
            lastName: userFiels.lastName,
            phone: userFiels.phone,
        });
    }
};

/**
 * Login
 */
// exports.login = async (req, res) => {
//     try {
//         const user = await User.findByCredentials(req.body.email, req.body.password);
//         const { firstName, role } = user;
//         // Generate and store new token when login on seconde device
//         // const token = await user.generateAuthToken();
//         // res.send({ user, token });
        
//         // req.flash('successMsg', 'Vous êtes connecté avec succès!');
//         res.render('index.html', { 
//             firstName,
//             role
//          });
//     } catch (error) {
//         const errors = [];
//         const login = 'Unable to login!';
//         errors.push(login);

//         // res.status(401).send({ error: 'Unable to login!' });
//         res.status(401).render('login.html', { errors });
//     }
// };

// With passport
exports.login = async (req, res, next) => {
    passport.authenticate('local',
    // function(req, data) {
        // if (req.user) {
        //     if (req.user.role === 'Admin') {
        //         res.redirect('/dashboard-admin');
        //     } else {
        //         res.redirect('/');
        //     }
        // }
    // }
    {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }
    )(req, res, next);
};

/**
 * Logout from current device
 */
// exports.logout = async (req, res) => {
//     try {
//         // req.user.tokens = req.user.tokens.filter(item => item.token !== req.token);
//         const tokenIndex = req.user.tokens.findIndex(item => item.token === req.token);
//         req.user.tokens.splice(tokenIndex, 1);
//         await req.user.save();

//         res.send();
//     } catch (error) {
//         res.status(500).send(error);    
//     }
// };

exports.logout = async (req, res) => {
    req.logout();
    req.flash('successMsg', 'Vous êtes déconnecté avec succès.');
    res.redirect('/login');
};

/**
 * Logout from all device
 */
exports.logoutAll = async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * Find profile of current user
 */
exports.findOwnProfile = async (req, res) => {
    res.send(req.user);
};

/**
 * Update current user
 */
exports.updateUser = async (req, res) => {
    // Define allowed fields to be updated 
    const keysUpdate = Object.keys(req.body);
    const allowedToBeUpdated = ['password', 'firstName', 'lastName', 'phone'];
    const isValidFields = keysUpdate.every(key => allowedToBeUpdated.includes(key));

    if (!isValidFields) {
        return res.status(400).send({ error: 'Invalid updates!'});
    }

    try {
        // The only way to get the hooks execute is to use separate save() calls as mentioned above.
        keysUpdate.forEach((key) => req.user[key] = req.body[key]);
        req.user.updatedAt = new Date();
        await req.user.save();

        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
};

/**
 * Delete own profile
 */
exports.deleteUser = async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * Upload avatar
 */
// Register an middleware for key avatar
// exports.uploadAvatar = async (req, res) => {
//     // Resize file, convert format in jpg and save it in buffer type
//     const buffer = await sharp(req.file.buffer)
//     .resize({ width: 250, height: 250 })
//     .jpeg()
//     .toBuffer();
//     req.user.avatar = buffer;

//     // Store file in field model avatar
//     await req.user.save();
//     res.send();
// }, (error, req, res, next) => {
//     res.status(404).send({ error: error.message });
// };

/**
 * Delete avatar
 */
exports.deleteAvatar = async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        
        res.send();
    } catch (error) {
        res.status(404).send(error);
    }
};

/**
 * Fetch image back and render it in right format 
 */
// <img src="http://localhost:3000/users/5e5c609b4218c53f68f0abd6/avatar" alt="">
exports.fetchAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        //  || !user.avatar
        if (!user) {
            throw new Error();
        }
        
        // Set the type of file
        res.set('Content-Type', 'image/jpeg');
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send(error);
    }
};