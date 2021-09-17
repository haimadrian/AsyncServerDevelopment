const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth");
const expense = require("../model/mongo/expense");

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

router.get('/fetch', auth, (req, res) => {
    const ITEMS_PER_WINDOW = 10;
    console.log('hii from getTransactions');

    const page = req.body.page;
    const limit = req.body.limit || ITEMS_PER_WINDOW;
    expense.find({ userId: req.userId })
        .sort({ "date": -1 })
        .skip(ITEMS_PER_WINDOW * page)
        .limit(limit)
        .exec()
        .then(expense => res.status(200).json(expense))
        .catch(error => res.status(500).json({ message: error.message }));
});

router.get('/fetch/category/:category', auth, (req, res) => {
    console.log('hii from getExpenseByCategory');

    const category = req.params.category;

    console.log('category: ', category);

    expense.find({ userId: req.userId, category: category })
        .exec()
        .then(expenses => res.status(200).json(expenses))
        .catch(error => res.status(500).json({ message: error.message }));

});

module.exports = router;
