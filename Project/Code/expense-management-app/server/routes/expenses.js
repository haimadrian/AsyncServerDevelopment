const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth");
const expense = require("../model/mongo/expense");

/* ----------------------------- add an expense ----------------------------- */
router.post('/', auth, (req, res) => {
    console.log('hii from addExpense');
    if (!req.body) { // if not empty
        res.status(400).send({ message: 'Content can not be empty!' });
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
            .save(newExpense)
            .exec()
            .then(data => res.send(data))
            .catch(err => res.status(500)
                .send({ message: err.message || 'error occurred while save expense' }));
    }
});
/* ----------------------------- get expense ------------------------- */
router.post('/fetch', auth, (req, res) => {
    // const ITEMS_PER_WINDOW = 10; //expense.countDocuments({ userId: req.userId });
    //const PAGE_DEFAULT = 0;
    // {"page":0 , "limit": 10}
    const page = req.body.page || 0;
    const limit = req.body.limit;

    if (limit) {
        expense.find({ userId: req.userId }, { _id: 0, __v: 0 }) // {},{suppress: '_id' and '__v' fields}
            .sort({ "date": -1 }) // arrange by date
            .skip(limit * page)
            .limit(limit)
            .exec()
            .then(expense => res.status(200).json(expense))
            .catch(error => res.status(500).json({ message: error.message }));
    } else {
        expense.find({ userId: req.userId }, { _id: 0, __v: 0 })
            .sort({ "date": -1 })
            .skip(page)
            .exec()
            .then(expense => res.status(200).json(expense))
            .catch(error => res.status(500).json({ message: error.message }));
    }

});

/* ------------------------- get Expense by Category ------------------------ */
router.get('/fetch/category/:category', auth, (req, res) => {
    console.log('hii from getExpenseByCategory');

    const category = req.params.category;

    console.log('category: ', category);

    expense.find({ userId: req.userId, category: category }, { _id: 0, __v: 0 })
        .exec()
        .then(expenses => res.status(200).json(expenses))
        .catch(error => res.status(500).json({ message: error.message }));

});


/* -------------------------- get page counts total -------------------------- */
router.post('/count', auth, (req, res) => {
    console.log('hii from get page number');

    expense.countDocuments({ userId: req.userId })
        .then(num_of_pages => res.status(200).json(num_of_pages))
        .catch(error => res.status(500).json({ message: error.message }));

});

module.exports = router;
