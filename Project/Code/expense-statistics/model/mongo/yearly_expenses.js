const mongoose = require('mongoose');
const expenseStatisticSchema = require('./expense_statistics');

// Export function to create "YearlyExpenses" model
module.exports = mongoose.model('yearlyexpenses', expenseStatisticSchema);