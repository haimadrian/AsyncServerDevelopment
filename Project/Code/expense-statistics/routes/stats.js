const express = require('express');
const router = express.Router();

// GET daily statistics for a user
router.get('/daily/user/:userId/:year/:month', function (req, res, next) {
    res.send(`User with id: ${req.params.userId}, Year: ${req.params.year}, ` +
        `Month: ${req.params.month}`);
});

router.get('/weekly/user/:userId', function (req, res, next) {
    res.send(`User with id: ${req.params.userId}`);
});

// GET daily statistics for a group
router.get('/daily/group/:groupId/:year/:month', function (req, res, next) {
    res.send(`Group with id: ${req.params.groupId}, Year: ${req.params.year}, ` +
        `Month: ${req.params.month}`);
});

module.exports = router;
