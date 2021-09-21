const mongoose = require('mongoose');

// Define a schema
const expenseStatisticSchema = new mongoose.Schema({
    userId: String,
    date: Date,
    totalExpenses: Number, // Dollar
    categoryToExpenses: [{
        category: String,
        totalExpenses: Number
    }]
});

// Export expenseStatisticSchema so we can re-use it for all statistic collections
module.exports = expenseStatisticSchema