const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth");
const statistics = require("../model/mongo/expense_statistics");

const mongoose = require('mongoose');

const dailyExpenses = mongoose.model('dailyexpenses', statistics);
const monthlyExpenses = mongoose.model('monthlyexpenses', statistics);
//const weeklyExpenses = mongoose.model('weeklyexpenses', statistics);
//const yearlyExpenses = mongoose.model('yearlyexpenses', statistics);

// GET yearly statistics for a user
/* router.post('/yearly', (req, res) => { 

    const year = req.body.year;
    const month = req.body.month;

    console.log(`GET yearly statistics for a user year: ${year}, month: ${month}`); //2001-12-31T22:00:00.000+00:00
    // https://docs.mongodb.com/manual/reference/operator/query-comparison/

    yearlyExpenses.findOne({
        userId: 'user-Id'
        , date: {
            $gt: ("$" + year),
            // $lt: ("2004")
        }
    }
        , { _id: 0, __v: 0 })
        .exec()
        .then(expense_statistics => res.status(200).json(expense_statistics))
        .catch(error => res.status(500).json({ message: error.message }));

}); */

router.post('/fetch', auth, (req, res) => { // todo add auth, // req.userId

    const year = req.body.year;
    const month = req.body.month;

    console.log(`GET yearly statistics for a user year: ${year}, month: ${month}`);

    if (year && month) { // get daily Expenses

        dailyExpenses.find({
            userId: 'user-Id'
            , date: {
                $gte: ("$" + year + "-" + "$" + month + "-02"),
                //$gte: ("2000-10-01"),
                //$lt: ("2000-11-01"),
                $lt: ("$" + year + "-" + "$" + (month + 1) + "-02")
            }
        }
            , { _id: 0, __v: 0 })
            .sort({ "date": 1 })
            .exec()
            .then(expense_statistics => res.status(200).json(expense_statistics))
            .catch(error => res.status(500).json({ message: error.message }));

        /*  dailyExpenses.aggregate([
             { $addFields: { "month": { $month: '$date' } } },
             { $addFields: { "year": { $year: '$date' } } },
             { $match: { month: month, year: year } }
         ])
             .sort({ "date": 1 })
             .exec()
             .then(expense_statistics => res.status(200).json(expense_statistics))
             .catch(error => res.status(500).json({ message: error.message })); */

    } else if (year) { // get monthly Expenses

        monthlyExpenses.find({
            userId: 'user-Id'
            , date: {
                $gte: ("$" + year + "-" + "01-01"),
                // $gte: ("2001-01-01"),
                // $lt: ("2001-12-31"),
                $lt: ("$" + year + "-" + "12-31")
            }
        }
            , { _id: 0, __v: 0 })
            .sort({ "date": 1 })
            .exec()
            .then(expense_statistics => res.status(200).json(expense_statistics))
            .catch(error => res.status(500).json({ message: error.message }));

    }  //empty



});




module.exports = router;


/*  $gte: ("$" + year + "-" + "01"),
 $lt: ("$" + year + "-" + "$" + month) */