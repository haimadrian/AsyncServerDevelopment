const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const expense = require("../model/mongo/expense");

/* ----------------------------- add an expense ----------------------------- */
router.post('/', auth, (req, res) => {
    if (!req.body) { // if not empty
        res.status(400).send({message: 'Content can not be empty!'});
    } else {
        // new expense
        const newExpense = new expense({
            userId: req.userId,
            sum: req.body.sum,
            currency: req.body.currency,
            category: req.body.category,
            description: req.body.description,
            date: req.body.date
        });

        // save expense in the database
        expense
            .create(newExpense)
            .then(data => res.send(data))
            .catch(err => res.status(500)
                .send({message: err.message || 'error occurred while save expense'}));
    }
});

/* -------------------------- get number of expense ------------------------- */
router.post('/fetch', auth, (req, res) => {
    const page = req.body.page || 0;
    const limit = req.body.limit;

    if (limit) {
        expense.find({userId: req.userId}, {_id: 0, __v: 0})
            .sort({"date": -1}) // arrange by date
            .skip(limit * page)
            .limit(limit)
            .exec()
            .then(expense => res.status(200).json(expense))
            .catch(error => res.status(500).json({message: error.message}));
    } else {
        expense.find({userId: req.userId}, {_id: 0, __v: 0})
            .sort({"date": -1})
            .skip(page)
            .exec()
            .then(expense => res.status(200).json(expense))
            .catch(error => res.status(500).json({message: error.message}));
    }

});

/* ------------------------- get Expense by Category ------------------------ */
router.get('/fetch/category/:category', auth, (req, res) => {
    const category = req.params.category;
    expense.find({userId: req.userId, category: category}, {_id: 0, __v: 0})
        .exec()
        .then(expenses => res.status(200).json(expenses))
        .catch(error => res.status(500).json({message: error.message}));

});


/* -------------------------- get page counts total -------------------------- */
router.post('/count', auth, (req, res) => {
    expense.countDocuments({userId: req.userId})
        .then(num_of_pages => res.status(200).json(num_of_pages))
        .catch(error => res.status(500).json({message: error.message}));

});

/*
 * API to fetch ALL expenses from MongoDB.
 * This API is not protected for a user access, but for admin access. Hence we use it
 * quite different.
 * Instead of using the auth middleware, which works with Firebase for user authorization,
 * we decode the JWT by ourselves and compare the content of it to Mongo credentials.
 * This way we can authorize expense-statistics server which requests all of the statistics
 * of some day.
 */
router.get('/fetch/all/start/:start/end/:end', authAdmin, (req, res) => {
    let startTime = new Date(parseInt(req.params.start));
    let endTime = new Date(parseInt(req.params.end));

    console.log('Querying all expenses between', startTime, '(inclusive) to', endTime, '(exclusive)');
    expense.find({date: {$gte: startTime, $lt: endTime}}, {_id: 0, __v: 0})
        .sort({"date": 1})
        .exec()
        .then(expenses => res.status(200).json(expenses))
        .catch(error => res.status(500).json({message: error.message}));
});

module.exports = router;
