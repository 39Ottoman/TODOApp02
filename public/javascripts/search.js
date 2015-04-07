var todoLists;

// ページ表示時にToDoリストを読込
$(function() {
    getTodoLists();
    console.log('todoLists', todoLists);
});

// リストの作成ボタンを押すとToDoリストを追加し再表示
$('#searchButton').click(function() {
    findTodo();
    return false;
});

// 条件に該当するTodoを取得+表示
function findTodo() {
    var $query = $('#query');
    var $results = $('#results');
    var $message = $('#resultMessage');
    $results.fadeOut(function() {
        $results.children().remove();
        
        // /todosにGETでアクセス
        $.get('/todos/?name=' + $query.val(), function(todos) {
            console.log(todos);
            // Todoがなければメッセージを表示
            if(todos.length === 0) {
                $message.text('対象のToDoは見つかりません');
                $message.css('color', 'red');
            } else {
                $message.text(todos.length + '件見つかりました');
                $message.css('color', 'black');
            }
            // 取得したToDoがあれば表示
            $.each(todos, function(index, todo) {
                // ToDoの所属しているリストを取得
                var todoList = findTodoList(todo.listId, todoLists);
                var todoButton = '<div class="panel">'
                    + '<h3>' + todo.name + '</h3>'
                    + '期限：　' + new Date(todo.limitDate).toLocaleDateString('ja-JP') + '</br>'
                    + '作成日：' +  new Date(todo.createdDate).toLocaleDateString('ja-JP') + '</br>'
                    + '<input type="button" value="' + (todo.isCheck? '完了': '未完了') + '"/></br>'
                    + 'リスト：<a href="/todopage/' + todoList._id + '">' + todoList.name + '</a></br>'
                    + '</div>';
                $results.prepend(todoButton);
            });
        });
    });
    $results.fadeIn();
}

// サーバからToDoリストの一覧を取得する
function getTodoLists() {
    // /todolistsにGETでアクセス
    $.get('/todolists', function(results) {
        // 取得したToDoリストを追加
        console.log('results', results);
        todoLists = results;
    });
}

// ローカルに取得済みのToDoリストから、listIdの一致するものを見つける
function findTodoList(listId, todoLists) {
    console.log(listId, todoLists);
    var result;
    $.each(todoLists, function(index, todoList) {
        if(todoList._id === listId) {
            console.log(todoList);
            result = todoList;
        }
    });
    return result;
}