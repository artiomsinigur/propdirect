const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Property = require('./Property');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: ['Email required.'],
        trim: true,
        lowercase: true,
        validate(value) {
            if (!isEmail(value)) {
                throw new Error('Email must be valid!');
            }
        }
    },
    password: {
        type: String,
        required: ['Password required.'],
        trim: true,
        minlength: 6
    },
    firstName: {
        type: String,
        trim: true,
        maxlength: 30
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: 30
    },
    phone: {
        type: String,
        trim: true,
        match: [/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/, 'Please provide a valid phone number.'],
    },
    role: {
        type: String,
        required: ['Role required.'],
    },
    banned: {
        type: Boolean,
        default: false
    },
    company: {
        type: String,
        trim: true,
        minlength: [3, 'Minimum 3 characters required.'],
        maxlength: [50, 'Maximum 50 characters allowed.'],
    },
    companyNumber: {
        type: Number,
        trim: true,
        minlength: [8, 'Minimum 8 numbers required.'],
        maxlength: [17, 'Maximum 17 numbers allowed.'],
    },
    urlSite: {
        type: String,
        trim: true,
        maxlength: [150, 'Maximum 150 characters allowed.']
    },
    facebook: {
        type: String,
        trim: true,
        maxlength: [100, 'Maximum 100 characters allowed.']
    },
    linkedin: {
        type: String,
        trim: true,
        maxlength: [100, 'Maximum 100 characters allowed.']
    },
    tokens: [{
        token: {
            type: String,
            // required: true
        }
    }],
    rating: {
        rateCount: {
            type: Number
        },
        rateValue: {
            type: Number,
        }
    },
    interested: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

/**
 * Get public profile and hide sensitive data
 * This method will apply for every route where we show user data
 */
userSchema.methods.toJSON = function () {
    const user = this;
    // Convert in normal Object
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    // delete userObject.role;
    // delete userObject.banned;

    return userObject;
}

/**
 * Generate token
 */
userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ _id: this._id.toString() }, 'secretkeyofpropDirect');

    // Store token
    this.tokens.push({ token });
    await this.save();

    return token; 
};

/**
 * Check the validity of credentials
 */
userSchema.statics.findByCredentials = async (email, password) => {
    // Step 1 check email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Unable to login!');
    }

    // Step 2 check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login!');
    }

    return user;
}

/**
 * Middleware - Hash plain text password
 */
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }

    // Call next when are done
    next();
});

/**
 * Middleware - Delete owner properties when owner is deleted
 */
userSchema.pre('remove', async function (next) {
    await Property.deleteMany({ owner: this._id });
    next();
});



// With Mongoose, everything is derived from a Schema. 
const User = mongoose.model('User', userSchema);

    // const me = new User({
    //     password: 1315335,
    //     email: 'email@masil.com',
    //     phone: '514 456-7890',
    //     role: 1,
    //     company: 'sdewr',
    // })

    // // me.save()
    // .then((res) => {
    //     console.log(res);
    // })
    // .catch((err) => {
    //     console.error('Error!', err);
    // })
    
module.exports = User;