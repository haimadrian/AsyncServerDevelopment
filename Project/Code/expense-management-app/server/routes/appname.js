const express = require('express');
const router = express.Router();

/* GET application name. */
router.get('/', function(req, res, next) {
  res.send('Expense Management');
});

module.exports = router;
