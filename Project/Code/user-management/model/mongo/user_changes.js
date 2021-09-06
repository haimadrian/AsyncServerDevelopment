const mongoose = require('mongoose');

// Define a schema
const userChangesSchema = new mongoose.Schema({
    userId: String,
    changes: [{
        propertyName: String,
        propertyValue: {}
    }],
    version: Number
});

// Export function to create "UserChanges" model
module.exports = mongoose.model('userchanges', userChangesSchema);