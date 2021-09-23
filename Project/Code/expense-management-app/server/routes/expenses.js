const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const expense = require("../model/mongo/expense");

/* ----------------------------- add an expense ----------------------------- */
router.post('/', auth, async (req, res) => {
    if (!req.body) {
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

        try {
            // save expense in the database
            const data = await expense.create(newExpense);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).send({message: error.message});
        }
    }
});

router.delete('/', auth, async (req, res) => {
    if (!req.body?.expenseId) {
        res.status(400).send({message: 'Content can not be empty!'});
    } else {
        const expenseId = req.body.expenseId;

        try {
            // Delete expense from the database
            // We disallow deletion of the past day since it would corrupt computed statistics.
            const startTime = new Date(Date.now());
            startTime.setUTCHours(0, 0, 0, 0);
            const deletedCountResult = await expense.deleteOne({
                _id: expenseId,
                userId: req.userId,
                date: {$gte: startTime}
            });

            if (deletedCountResult.deletedCount > 0) {
                res.status(200).json(deletedCountResult);
            } else {
                const errorMessage = "Unable to delete expense. You can delete today's expenses only";
                res.status(400).json({message: errorMessage});
            }
        } catch (error) {
            res.status(400).json({message: error.message});
        }
    }
});

async function handleFetchExpensesRequest(req, res, page, limit = undefined) {
    let isOk = true;

    try {
        page = parseInt(page || "0");
        limit = parseInt(limit || "10");
    } catch (ignore) {
        isOk = false;
        res.status(404).json({message: "page and limit must be numbers"});
    }

    if (isOk) {
        let query = expense.find({userId: req.userId}, {__v: 0})
            .sort({"date": -1}) // arrange by date
            .skip(limit * page);

        if (limit) {
            query = query.limit(limit);
        }

        try {
            const expenses = await query.exec();
            res.status(200).json(expenses);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
}

/* -------------------------- get expenses of user ------------------------- */
router.get('/fetch/page/:page', auth, async (req, res) => {
    await handleFetchExpensesRequest(req, res, req.params.page);
});

/* -------------------------- get expenses of user ------------------------- */
router.get('/fetch/page/:page/limit/:limit', auth, async (req, res) => {
    await handleFetchExpensesRequest(req, res, req.params.page, req.params.limit);
});

/* ------------------------- get Expense by Category ------------------------ */
router.get('/fetch/category/:category', auth, (req, res) => {
    const category = req.params.category;
    expense.find({userId: req.userId, category: category}, {__v: 0})
        .exec()
        .then(expenses => res.status(200).json(expenses))
        .catch(error => res.status(500).json({message: error.message}));
});


/* -------------------------- get page counts total -------------------------- */
router.get('/count', auth, async (req, res) => {
    try {
        const userExpensesCount = await expense.countDocuments({userId: req.userId});
        res.status(200).json(userExpensesCount);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
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
router.get('/fetch/all/start/:start/end/:end', authAdmin, async (req, res) => {
    let startTime = undefined;
    let endTime = undefined;

    try {
        startTime = new Date(parseInt(req.params.start));
        endTime = new Date(parseInt(req.params.end));
    } catch (ignore) {
        res.status(400).json({message: "start and end must represent amount of millis since epoch"});
    }

    if (startTime) {
        console.log('Querying all expenses between', startTime, '(inclusive) to', endTime, '(exclusive)');

        try {
            const expenses =
                await expense.find({date: {$gte: startTime, $lt: endTime}},
                    {_id: 0, __v: 0})
                    .sort({"date": 1})
                    .exec();

            res.status(200).json(expenses);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
});

module.exports = router;
