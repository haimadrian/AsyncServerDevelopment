const express = require('express');
const router = express.Router();

// GET user by id.
// userId is accessible through req.params.userId
router.get('/:userId', function(req, res, next) {
  res.send(`User with id: ${req.params.userId}`);
});

router.put('/signup', function(req, res, next) {
  // Make sure userId is not "signup" or "signin", cause those are restricted paths here.
  res.send('Sign Up');
});

router.post('/signin', function(req, res, next) {
  res.send('Sign In');
});

module.exports = router;
