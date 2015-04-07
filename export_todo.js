var todos = db.todos.find();

print('_id,name,isCheck,createdDate,limitDate,listId');

todos.forEach(function(todo) {
  if (todo) {
    print('ObjectID(' + todo._id + '),"' + todo.name + '",' + todo.isCheck + ',ISODate("' + todo.createdDate.toISOString() + '"),ISODate("' + todo.limitDate.toISOString() + '"),"' + todo.listId + '"');
  }
});