const mongoose = require('mongoose');

// Define a schema
const userSchema = new mongoose.Schema({
    firebaseUserId: String,
    email: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    dateOfBirth: Date,
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: Number,
        country: String
    },
    maritalStatus: String,
    version: Number
});

// Export function to create "User" model
module.exports = mongoose.model('users', userSchema);