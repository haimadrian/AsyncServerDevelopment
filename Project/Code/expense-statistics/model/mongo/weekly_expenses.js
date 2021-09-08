const mongoose = require('mongoose');
const expenseStatisticSchema = require('expense_statistics');

// Export function to create "WeeklyExpenses" model
module.exports = mongoose.model('weeklyexpenses', expenseStatisticSchema);