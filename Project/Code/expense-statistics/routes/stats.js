const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth");
const statistics = require("../model/mongo/expense_statistics");

// GET daily statistics for a user
router.post('/daily', (req, res) => {

    const year = req.body.year;
    const month = req.body.month;

    console.log(`GET daily statistics for a user year: ${year} month: ${month}`);


    /*  statistics.find({ userId: req.userId, category: category }, { _id: 0, __v: 0 })
         .exec()
         .then(expenses => res.status(200).json(expenses))
         .catch(error => res.status(500).json({ message: error.message })); */

});

/* router.get('/weekly', function (req, res, next) {
    res.send(`User with id: ${req.params.userId}`);
}); */

// GET daily statistics for a group
/* router.get('/daily/group/:groupId/:year/:month', function (req, res, next) {
    res.send(`Group with id: ${req.params.groupId}, Year: ${req.params.year}, ` +
        `Month: ${req.params.month}`);
}); */

module.exports = router;
