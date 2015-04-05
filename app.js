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

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// /todolistにGETアクセスしたとき、ToDoリストの一覧を取得するAPI
app.get('/todolist', function(req, res) {
    console.log('/todolist GET');
    var TodoList = mongoose.model('TodoList');
    // 全てのToDoを取得して送信
    TodoList.find({}, function(err, todoLists){
        res.send(todoLists);
    });
});

// /todolistにPOSTアクセスしたとき、ToDoリストを追加するAPI
app.post('/todolist', function(req, res) {
    var name = req.body.name;
    // nameがあれば、MongoDBに保存
    if(name) {
        var TodoList = mongoose.model('TodoList');
        var todoList = new TodoList();
        todoList.name = name;
        todoList.save();
        
        res.send(true);
    } else {
        res.send(false);
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
