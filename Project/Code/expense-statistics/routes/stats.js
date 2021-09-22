const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const dailyExpenses = require("../model/mongo/daily_expenses");
const monthlyExpenses = require("../model/mongo/monthly_expenses");

function handleFetchRange(req, res, collection, year, month = undefined) {
    /* monthValue :
    0 represents January, 11 represents December,
    -1 represents December of the previous year,
    and 12 represents January of the following year.
    dayValue :
    0 is provided for dayValue, the date will be set to the last day of the previous month. */

    // create new dates
    const startTime = new Date();
    startTime.setUTCFullYear(year, month || 0, 1);
    startTime.setUTCHours(0, 0, 0, 0);

    const endTime = new Date(startTime.getTime());
    if (month) {
        endTime.setUTCMonth(month + 1);
    } else {
        endTime.setUTCFullYear(year + 1);
    }

    console.log('startTime:', startTime, 'endTime:', endTime);

    collection.find({userId: req.userId, date: {$gte: startTime, $lt: endTime}},
        {_id: 0, __v: 0})
        .sort({"date": 1})
        .exec()
        .then(expense_statistics => res.status(200).json(expense_statistics))
        .catch(error => res.status(500).json({message: error.message}));
}

router.get('/fetch/year/:year', auth, (req, res) => {
    const year = req.params.year;
    console.log(`year: ${year}`);
    handleFetchRange(req, res, monthlyExpenses, year);
});

router.get('/fetch/year/:year/month/:month', auth, (req, res) => {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    console.log('year:', year, 'month:', month);
    handleFetchRange(req, res, dailyExpenses, year, month);
});

module.exports = router;