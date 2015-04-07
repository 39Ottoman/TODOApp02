var listId;

// ページ表示時にToDoリストを読込
$(function() {
    listId = $('#listId').text();
    // /todolistにGETでアクセスしてリストの名前を取得
    $.get('/todolist/' + listId, function(todolist) {
        console.log(todolist);
        $('#listName').text(todolist.name);
    });
    
    showTodosWithFade();
});

// リストの作成ボタンを押すとToDoリストを追加し再表示
$('#createTodoButton').click(function() {
    createTodo();
    return false;
});

// Todoを表示
function showTodos() {
    var $todos = $('#todos');
    var $message = $('#todosMessage');

    // ToDo一覧を初期化
    $todos.children().remove();

    // /todosにGETでアクセス
    $.get('/todos/' + listId, function(todos) {
        console.log('todo - ' + listId);
        console.log(todos);
        // Todoがなければメッセージを表示
        if(todos.length === 0) {
            $message.text('Todoが作成されていません');
            $message.css('color', 'red');
        }
        // 取得したToDoがあれば表示
        $.each(todos, function(index, todo) {
            var todoButton = '<div class="panel" id="' + todo._id + '">'
                + '<h3>' + todo.name + '</h3>'
                + '期限：　' + new Date(todo.limitDate).toLocaleDateString('ja-JP') + '</br>'
                + '作成日：' +  new Date(todo.createdDate).toLocaleDateString('ja-JP') + '</br>'
                + '<input type="button" class="check" value="' + (todo.isCheck? '完了': '未完了') + '"/></br>'
                + '</div>';
            $todos.prepend(todoButton);
            // ボタンを押したときに完了・未完了の切り替えが出来るようにする
            var $checkButton = $('#' + todo._id + '>.check');
            $checkButton.click(function() {
                checkTodo(todo._id, !todo.isCheck);
            });
        });
    });
    
}

// フェードしながらToDoを表示
function showTodosWithFade() {
    $('#todos').fadeOut(function() {showTodos();});
    $('#todos').fadeIn();
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
    if(name && limitDate) {
        $.post('/todo', data, function(res) {
            console.log('/todo POST ' + res);
            // リストが作成されたらリストを更新+メッセージ表示
            if(res) {
                showTodosWithFade();
                console.log('create ' + name + '!');
                $message.text('新しいToDoが作成されました');
                $message.css('color', 'black');
            }

        });
    } else {
        $message.text('ToDo名と期限を両方とも入力してください');
        $message.css('color', 'red');
    }
}

// 該当するToDoの完了・未完了を切り替える
function checkTodo(todoId, isCheck) {
    $.ajax({
        type: 'PUT',
        url: '/todo/' + todoId + '/check',
        data: 'isCheck=' + isCheck,
        success: function(res) {
            console.log('/todo/:todoId/check PUT ' + res);
            if(res) {
                showTodos();
            }
        }
    });
}