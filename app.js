var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// MongoDBへ接続
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/step2');
// スキーマの設定
var Schema = mongoose.Schema;
var todoListSchema = new Schema({
  name: String
});
mongoose.model('TodoList', todoListSchema);
var todoSchema = new Schema({
  isCheck: {
    type: Boolean,
    default: false
  },
  name: String,
  createdDate: {
    type: Date,
    default: Date.now
  },
  limitDate: Date,
  listId: String
});
mongoose.model('Todo', todoSchema);

var routes = require('./routes/index');
var users = require('./routes/users');
var todopage = require('./routes/todopage');
var search = require('./routes/search');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/todopage', todopage);
app.use('/search', search);

// /todolistsにGETアクセスしたとき、ToDoリストの一覧を取得するAPI
app.get('/todolists', function (req, res) {
  console.log('/todolists GET');
  // 全てのToDoを取得して送信
  var TodoList = mongoose.model('TodoList');
  TodoList.find({}, function (err, todoLists) {
    res.send(todoLists);
  });
});

// /todolist/:listIdにGETアクセスしたとき、該当するToDoリスト(1つ)を取得するAPI
app.get('/todolist/:listId', function (req, res) {
  var listId = req.params.listId;
  // ToDoを取得して送信
  var TodoList = mongoose.model('TodoList');
  TodoList.findOne({
    _id: listId
  }, function (err, todoList) {
    res.send(todoList);
  });
});

// /todolistにPOSTアクセスしたとき、ToDoリストを追加するAPI
app.post('/todolist', function (req, res) {
  var name = req.body.name;
  // nameがあれば、MongoDBに保存
  if (name) {
    var TodoList = mongoose.model('TodoList');
    var todoList = new TodoList();
    todoList.name = name;
    todoList.save();

    res.send(true);
  } else {
    res.send(false);
  }
});

// /todos/:listIdにGETアクセスしたとき、該当するリストのToDo一覧を取得するAPI
app.get('/todos/:listId', function (req, res) {
  var listId = req.params.listId;
  // listIdが該当するToDoがあれば、MongoDBから取得+送信
  var Todo = mongoose.model('Todo');
  Todo.find({
    listId: listId
  }, function (err, todos) {
    res.send(todos);
  });
});

// /todosにquery付きでGETアクセスしたとき、該当するToDoの一覧を取得するAPI
app.get('/todos', function (req, res) {
  var name = req.query.name;
  console.log('req.query.name = ' + name);
  if (name) {
    var Todo = mongoose.model('Todo');
    Todo.find({
      name: new RegExp('.*' + name + '.*', 'i')
    }, function (err, todos) {
      res.send(todos);
    });
  }
});

// /todoにPOSTアクセスしたとき、該当するリストにToDoを追加するAPI
app.post('/todo', function (req, res) {
  var listId = req.body.listId;
  var name = req.body.name;
  var limitDate = req.body.limitDate;
  console.log(listId, name, limitDate);
  // listId・name・limitDateがあれば、MongoDBに保存
  if ((listId && name) && limitDate) {
    var Todo = mongoose.model('Todo');
    var todo = new Todo();
    todo.name = name;
    todo.limitDate = new Date(limitDate);
    todo.listId = listId;
    todo.save();
    res.send(true);
  } else {
    res.send(false);
  }
});

// /todo/:todoId/checkにPUTアクセスしたとき、該当するToDoのcheck属性を変更する
app.put('/todo/:todoId/check', function (req, res) {
  var todoId = req.params.todoId;
  var isCheck = req.body.isCheck;
  var Todo = mongoose.model('Todo');
  Todo.update({
    _id: todoId
  }, {
    $set: {
      isCheck: isCheck
    }
  }, function (err) {
    res.send(true);
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;