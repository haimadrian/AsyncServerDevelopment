const express = require('express');
const auth = require("../middleware/auth");
const userAuthCache = require("../model/user_auth_cache");
const user = require("../model/mongo/user");
const router = express.Router();

// GET user by id.
// userId is accessible through req.params.userId
router.get('/info', auth, function (req, res) {
    user.findOne({userId: req.userId})
        .exec()
        .then(user => res.status(200).json(user))
        .catch(() => res.status(404).json({message: 'NOT FOUND'}));
});

router.put('/signup', auth, function (req, res) {
    res.send('Sign Up');
});

router.post('/signout', auth, function (req, res) {
    userAuthCache.remove(req.jwt);
    res.status(200).json({message: 'Signed Out'});
});

module.exports = router;
