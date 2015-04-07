var express = require('express');
var router = express.Router();

// ToDoを検索するページを表示
router.get('/', function (req, res, next) {
  res.render('search');
});

module.exports = router;