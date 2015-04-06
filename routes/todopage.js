var express = require('express');
var router = express.Router();

// ToDoを確認するページを表示
router.get('/:listId', function(req, res, next) {
  console.log("/todopage/:listId GET");
  var listId = req.params.listId;
  console.log(listId);
  res.render('todopage', { listId: listId });
});

module.exports = router;