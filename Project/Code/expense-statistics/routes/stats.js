const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const dailyExpenses = require("../model/mongo/daily_expenses");
const monthlyExpenses = require("../model/mongo/monthly_expenses");

function handleFetchRange(req, res, collection, year, month = undefined) {
    let isOk = true;
    let yearAsNum;
    let monthAsNum;

    try {
        yearAsNum = parseInt(year || "2021");
        monthAsNum = parseInt(month || "0");
    } catch (ignore) {
        isOk = false;
        res.status(404).json({message: "year and month must be numbers"});
    }

    if (isOk) {
        // create new dates
        const startTime = new Date();
        startTime.setUTCFullYear(yearAsNum, monthAsNum, 1);
        startTime.setUTCHours(0, 0, 0, 0);

        const endTime = new Date(startTime.getTime());
        if (month && (monthAsNum >= 0) && (monthAsNum <= 11)) {
            endTime.setUTCMonth(monthAsNum + 1);
        } else {
            endTime.setUTCFullYear(yearAsNum + 1);
        }

        console.log('startTime:', startTime, 'endTime:', endTime);

        collection.find({userId: req.userId, date: {$gte: startTime, $lt: endTime}},
            {_id: 0, __v: 0})
            .sort({"date": 1})
            .exec()
            .then(expense_statistics => res.status(200).json(expense_statistics))
            .catch(error => res.status(500).json({message: error.message}));
    }
}

router.get('/year/:year', auth, (req, res) => {
    handleFetchRange(req, res, monthlyExpenses, req.params.year);
});

router.get('/year/:year/month/:month', auth, (req, res) => {
    handleFetchRange(req, res, dailyExpenses, req.params.year, req.params.month);
});

module.exports = router;
