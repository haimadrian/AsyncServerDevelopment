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

    /*  monthValue : 
    A zero-based integer representing the month of the year offset from the start of the year.
    So, 0 represents January, 11 represents December,
    -1 represents December of the previous year,
    and 12 represents January of the following year.
  */

    /* dayValue : 0 is provided for dayValue, the date will be set to the last day of the previous month. */

    // create new date 
    const startTime = new Date();
    if (year) startTime.setYear(year);
    if (month) startTime.setMonth(month - 1); else startTime.setMonth(0);
    startTime.setDate(1);
    startTime.setHours(0, 0, 0, 0);

    const endTime = new Date();
    if (year) endTime.setYear(year);
    if (month) endTime.setMonth(month); else endTime.setMonth(11);
    endTime.setDate(1);
    endTime.setHours(0, 0, 0, -1);

    console.log(`startTime: ${startTime}, endTime: ${endTime}`);

    let collection = dailyExpenses;
    if (!month)
        collection = monthlyExpenses;
    /* else  // get all */

    collection.find({
        userId: 'user-Id'

        /* , date: { //! this works DKW need to start 02
            $gte: ("$" + year + "-" + "$" + month + "-02"),
            //$gte: ("2000-10-01"),
            //$lt: ("2000-11-01"),
            $lt: ("$" + year + "-" + "$" + (month + 1) + "-02")
        } */

        , date: { $gte: startTime, $lt: endTime }
    }
        , { _id: 0, __v: 0 })
        .sort({ "date": -1 })
        .exec()
        .then(expense_statistics => res.status(200).json(expense_statistics))
        .catch(error => res.status(500).json({ message: error.message }));

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


});


module.exports = router;


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