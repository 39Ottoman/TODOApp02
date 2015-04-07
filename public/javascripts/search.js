var todoLists;

// ページ表示時にToDoリストを読込
$(function () {
  getTodoLists();
  console.log('todoLists', todoLists);
});

// リストの作成ボタンを押すとToDoリストを追加し再表示
$('#searchButton').click(function () {
  findTodo();
  return false;
});

// 条件に該当するTodoを取得+表示
function findTodo() {
  var $query = $('#query');
  var $results = $('#results');
  var $message = $('#resultMessage');
  $results.fadeOut(function () {
    // メッセージを初期化
    $message.text('');

    // /todosにGETでアクセス
    $.get('/todos/?name=' + $query.val(), function (todos) {
      console.log(todos);
      // 一覧を初期化
      $results.children().remove();

      // Todoがなければメッセージを表示
      if (todos.length === 0) {
        $message.text('対象のToDoは見つかりません');
        $message.css('color', 'red');
      } else {
        $message.text(todos.length + '件見つかりました');
        $message.css('color', 'black');
        // 取得したToDoがあれば表示
        $.each(todos, function (index, todo) {
          // ToDoの所属しているリストを取得
          var todoList = findTodoList(todo.listId, todoLists);
          var todoButton = '<div class="panel">' + '<div style="float: left;">' + '<h3>' + todo.name + '</h3>' + 'リスト：<a href="/todopage/' + todoList._id + '">' + todoList.name + '</a></br>' + '</div>' + '<div style="float: right; padding-top: 20px;">' + '<table><tr>' + '<td>期限：</td><td>' + new Date(todo.limitDate).toLocaleDateString('ja-JP') + '</td></tr>' + '<tr>' + '<td>作成日：</td><td>' + new Date(todo.createdDate).toLocaleDateString('ja-JP') + '</td></tr>' + '</table></div>' + '<div style="clear: both;"></div>' + '</div>';
          $results.prepend(todoButton);
        });
      }
    });
  });
  $results.fadeIn();
}

// サーバからToDoリストの一覧を取得する
function getTodoLists() {
  // /todolistsにGETでアクセス
  $.get('/todolists', function (results) {
    // 取得したToDoリストを追加
    console.log('results', results);
    todoLists = results;
  });
}

// ローカルに取得済みのToDoリストから、listIdの一致するものを見つける
function findTodoList(listId, todoLists) {
  console.log(listId, todoLists);
  var result;
  $.each(todoLists, function (index, todoList) {
    if (todoList._id === listId) {
      console.log(todoList);
      result = todoList;
    }
  });
  return result;
}