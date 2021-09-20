const express = require('express');
const router = express.Router();

/* GET firebase project configuration so client can configure firebase. */
router.get('/', function(req, res, next) {
  res.status(200).json({
    apiKey: "AIzaSyDvrxAASgMVdVJ9yoq_BS3DqAknyXy0ZIY",
    authDomain: "expenseapphit.firebaseapp.com",
    projectId: "expenseapphit",
    storageBucket: "expenseapphit.appspot.com",
    messagingSenderId: "300397356959",
    appId: "1:300397356959:web:527b4fcc60b647d0f97faa",
    measurementId: "G-2D2XPSJ53G"
  });
});

module.exports = router;
