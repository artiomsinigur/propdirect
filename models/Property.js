const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: ['Title required.'],
        trim: true,
        minlength: [3, 'Minimum 3 characters required.'],
        maxlength: [70, 'Maximum 70 characters allowed.'],
    },
    price: {
        type: Number,
        trim: true,
        required: ['Price required.'],
        min: [1, 'Minimum 1 numbers required.'],
        max: [1000000000, 'Maximum 1 Billion allowed.'],
    },
    description: {
        type: String,
        trim: true,
        // match: [/^$|^.{10, 1500}$/, 'Allowed between 10 and 1500 characters'],
        maxlength: [1500, 'Maximum 1500 characters allowed.'],
    },
    number: {
        type: Number,
        trim: true,
    },
    street: {
        type: String,
        maxlength: [150, 'Maximum 150 characters allowed.'],
    },
    postalCode: {
        type: String,
        match: [/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, 'Please provide a valid postal code.']
    },
    bedroom: {
        type: Number,
    },
    bathroom: {
        type: Number,
    },
    yearConstruction: {
        type: Number,
        min: [1900, 'Minimum 1900 numbers required.'],
        max: [3000, 'Maximum 3000 numbers allowed.'],
    },
    dimension: {
        type: Number,
        min: [1, 'Minimum 1 numbers required.'],
        max: [10000, 'Maximum 10000 numbers allowed.'],
    },
    uriImages: {
        type: Array,
        required: ['At least one image is required.']
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type',
        required: ['Type required.']
    },
    province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Province'
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    }
}, {
    timestamps: true
})

// propertySchema.virtual('types', {
//     ref: 'Type',
//     localField: '_id',
//     foreignField: 'property'
// });

module.exports = mongoose.model('Property', propertySchema);