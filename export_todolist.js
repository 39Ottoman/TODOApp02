var todolists = db.todolists.find();

print('_id,name');

todolists.forEach(function(todolist) {
  if (todolist) {
    print('ObjectID(' + todolist._id + '),"' + todolist.name + '"');
  }
});