const mongoose = require('mongoose');

// Define a schema
const expenseSchema = new mongoose.Schema({
    userId: String,
    sum: Number,
    currency: String,
    category: String,
    description: String,
    date: Date
});

// Export function to create "Expense" model
module.exports = mongoose.model('expenses', expenseSchema);