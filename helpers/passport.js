const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
require('../db/mongoose');
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
            // const user = User.findByCredentials(email, passport);
            // Match user
            User.findOne({ email })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'Unable to login!' });
                }

                // Match password
                const isMatch = bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw new Error();

                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Unable to login!' });
                    }
                });
            })
            .catch(err => console.log(err))
        })
    )

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}