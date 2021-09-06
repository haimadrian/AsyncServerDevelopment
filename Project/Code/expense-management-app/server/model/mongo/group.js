const mongoose = require('mongoose');

// Define a schema
const groupSchema = new mongoose.Schema({
    groupId: String,
    groupName: String,
    dateCreated: Date,
    users: [String]
});

// Export function to create "Group" model
module.exports = mongoose.model('groups', groupSchema);