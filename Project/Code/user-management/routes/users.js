const express = require('express');
const router = express.Router();

// GET user by id.
// userId is accessible through req.params.userId
router.get('/info/:userId', function (req, res) {
    res.send(`User with id: ${req.params.userId}`);
});

router.put('/signup', function (req, res) {
    res.send('Sign Up');
});

router.post('/signin', function (req, res) {
    res.send('Sign In');
});

router.post('/signout', function (req, res) {
    res.send('Sign Out');
});

module.exports = router;
