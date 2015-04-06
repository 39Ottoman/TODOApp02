var listId;

// ページ表示時にToDoリストを読込
$(function() {
    listId = $('#listId').text();
    // /todolistにGETでアクセスしてリストの名前を取得
    
    
    getTodos();
});

// リストの作成ボタンを押すとToDoリストを追加し再表示
$('#createTodoButton').click(function() {
    createTodo();
    return false;
});

// Todoを表示
function getTodos() {
    var $todos = $('#todos');
    $todos.fadeOut(function() {
        $todos.children().remove();
        
        // /todoにGETでアクセス
        $.get('/todo/' + listId, function(todos) {
            console.log('todo/' + listId);
            console.log(todos);
            // 取得したToDoリストを追加
            $.each(todos, function(index, todo) {
                var todoButton = '<div class="panel">'
                    + '<a>' + todo.name + '</a></br>'
                    + 'ToDoはありません' + '</br>'
                    + '～9999年9月99日' + '</br>'
                    + todo.listId
                    + '</div>';
                $todos.append(todoButton);
            });
        });
    });
    $todos.fadeIn();
}

// 新しいToDoを作成+再表示
function createTodo() {
    var name = $('#newTodoName').val();
    var limitDate = $('#limitDate').val();
    var $message = $('#todosMessage');
    // メッセージ欄を初期化
    $message.text('');
    
    // 入力項目を空にする
    $('#newTodoName').val('');
    // /todoにPOSTでアクセス
    var data = {name: name, limitDate: limitDate, listId: listId};
    console.log(data);
    $.post('/todo', data, function(res) {
        console.log('/todo POST ' + res);
        // リストが作成されたらリストを更新+メッセージ表示
        if(res) {
            getTodos();
            console.log('create ' + name + '!');
            $message.text('新しいToDoが作成されました');
            $message.css('color', 'black');
        }

    });
}