const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");

// GET to verify JWT.
// Use this by our micro services in order to verify that a specified JWT is valid
// We just return 200 OK to indicate success. auth will return 401 in case of error.
router.get('/isvalid', auth, function(req, res, next) {
  res.status(200).json({ message: '200 OK' });
});

module.exports = router;
