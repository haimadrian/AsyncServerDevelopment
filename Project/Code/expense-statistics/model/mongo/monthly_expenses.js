const mongoose = require('mongoose');
const expenseStatisticSchema = require('./expense_statistics');

// Export function to create "MonthlyExpenses" model
module.exports = mongoose.model('monthlyexpenses', expenseStatisticSchema);