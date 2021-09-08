const mongoose = require('mongoose');
const expenseStatisticSchema = require('expense_statistics');

// Export function to create "DailyExpenses" model
module.exports = mongoose.model('dailyexpenses', expenseStatisticSchema);