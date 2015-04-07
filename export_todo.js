var todos = db.todos.find();

print('_id,name,isCheck,createdDate,limitDate,listId');

todos.forEach(function (todo) {
  if (todo) {
    print('ObjectID(' + todo._id + '),"' + todo.name + '",' + todo.isCheck + ',' + todo.createdDate.toISOString() + ',' + todo.limitDate.toISOString() + ',"' + todo.listId + '"');
  }
});