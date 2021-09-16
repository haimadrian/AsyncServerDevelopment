const mongoose = require('mongoose');

// Define a schema
const userChangesSchema = new mongoose.Schema({
    firebaseUserId: String,
    changes: [{
        propertyName: String,
        propertyValue: {}
    }],
    version: Number,
    updateDate: Date
});

// Export function to create "UserChanges" model
module.exports = mongoose.model('userchanges', userChangesSchema);