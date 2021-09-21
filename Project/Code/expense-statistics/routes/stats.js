const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth");
const statistics = require("../model/mongo/expense_statistics");

const mongoose = require('mongoose');
const dailyExpenses = mongoose.model('dailyexpenses', statistics);
const monthlyExpenses = mongoose.model('monthlyexpenses', statistics);
//const weeklyExpenses = mongoose.model('weeklyexpenses', statistics);
//const yearlyExpenses = mongoose.model('yearlyexpenses', statistics);

router.post('/fetch', auth, (req, res) => {

    const year = req.body.year;
    const month = req.body.month;

    console.log(`year: ${year}, month: ${month}`);

    /* monthValue : 
    0 represents January, 11 represents December,
    -1 represents December of the previous year,
    and 12 represents January of the following year.
    dayValue :
    0 is provided for dayValue, the date will be set to the last day of the previous month. */

    // create new dates 
    const startTime = new Date();
    if (year) startTime.setYear(year); else startTime.setYear(0);
    if (month) startTime.setMonth(month - 1); else startTime.setMonth(0);
    startTime.setDate(1);
    startTime.setHours(0, 0, 0, 0);

    const endTime = new Date();
    if (year) endTime.setYear(year); else endTime.setYear(new Date().getFullYear());
    if (month) endTime.setMonth(month); else endTime.setMonth(11);
    endTime.setDate(1);
    endTime.setHours(0, 0, 0, -1);

    console.log(`startTime: ${startTime}, endTime: ${endTime}`);

    //  According to what received from the body, refer to the appropriate collection
    let collection = dailyExpenses;
    if (!month)
        collection = monthlyExpenses;

    collection.find({
        userId: req.userId // user-Id
        , date: { $gte: startTime, $lt: endTime }
    }
        , { _id: 0, __v: 0 })
        .sort({ "date": -1 })
        .exec()
        .then(expense_statistics => res.status(200).json(expense_statistics))
        .catch(error => res.status(500).json({ message: error.message }));

});

module.exports = router;

/* ----------------------------------- // ----------------------------------- */

/*  $gte: ("$" + year + "-" + "01"),
 $lt: ("$" + year + "-" + "$" + month) */


/*  dailyExpenses.aggregate([
            { $addFields: { "month": { $month: '$date' } } },
            { $addFields: { "year": { $year: '$date' } } },
            { $match: { month: month, year: year } }
        ])
            .sort({ "date": 1 })
            .exec()
            .then(expense_statistics => res.status(200).json(expense_statistics))
            .catch(error => res.status(500).json({ message: error.message })); */



/* ----------------------------------- // ----------------------------------- */


/* , date: { //! this works DKW need to start 02
    $gte: ("$" + year + "-" + "$" + month + "-02"),
    //$gte: ("2000-10-01"),
    //$lt: ("2000-11-01"),
    $lt: ("$" + year + "-" + "$" + (month + 1) + "-02")
} */

/* ----------------------------------- // ----------------------------------- */


/*   if (year && month) { // get daily Expenses

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
 */