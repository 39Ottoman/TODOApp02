// ページ表示時にToDoリストを読込
$(function() {
    showTodoLists();
});

// リストの作成ボタンを押すとToDoリストを追加し再表示
$('#createListButton').click(function() {
    createTodoList();
    return false;
});

// Todoリストの一覧を取得+表示
function showTodoLists() {
    var $lists = $('#lists');
    $lists.fadeOut(function() {
        $lists.children().remove();
        // /todolistsにGETでアクセス
        $.get('todolists', function(todoLists) {
            // 取得したToDoリストを追加
            $.each(todoLists, function(index, todoList) {
                var listButton = '<div class="panel" id="' + todoList._id + '">'
                    + '<div class="todoListName"><a href="/todopage/' + todoList._id + '">' + todoList.name + '</a></div>'
                    + '<div class="info"></div>'
                    + '</div>';
                $lists.prepend(listButton);
                showListInformation(todoList._id);
            });
        });
    });
    $lists.fadeIn();
}

// 該当するToDoリストでのToDoの数・完了している数・直近の期限を詳細として表示
function showListInformation(listId) {
    // /todosにGETでアクセス
    var message;
    var $infoBox = $('#' + listId + '>.info');
    $.get('/todos/' + listId, function(todos) {
        console.log('todo - ' + listId);
        console.log(todos);
        // Todoがなければメッセージを表示
        var todoCount = todos.length;
        if(todos.length === 0) {
            message = '<div>Todoが作成されていません</div>';
        } else {
            // 取得したToDoの中での完了している数と直近の期限を求める
            var checkCount = 0;
            var recentLimitDate = new Date(todos[0].limitDate);
            $.each(todos, function(index, todo) {
                if(todo.isCheck === true) {
                    checkCount++;
                }
                var limitDate = new Date(todo.limitDate);
                if(recentLimitDate > limitDate) {
                    recentLimitDate = limitDate;
                }
            });
            message = '<div>' + todoCount + '個中' + checkCount + '個がチェック済み</div>'
                + '<div>～ ' + recentLimitDate.toLocaleDateString('ja-JP') + '</div>';
            console.log(message);
        }
        // ToDoリストの詳細として表示する
        $infoBox.html('');
        $infoBox.html(message);
    });
}

// 新しいToDoリストを作成+再表示
function createTodoList() {
    var name = $('#newListName').val();
    var $message = $('#topMessage');
    // トップ画面のメッセージ欄を初期化
    $message.text('');
    
    // リスト名が30文字以上の場合はエラー表示
    if(name.length > 30) {
        $message.text('リストの名称は30文字以内にしてください');
        $message.css('color', 'red');
    } else {
        // 入力項目を空にする
        $('#newListName').val('');
        // /todolistにPOSTでアクセス
        $.post('/todolist', {name: name}, function(res) {
            console.log('/todolist POST ' + res);
            // リストが作成されたらリストを更新+メッセージ表示
            if(res) {
                showTodoLists();
                console.log('create ' + name + '!');
                $message.text('新しいToDoリストが作成されました');
                $message.css('color', 'black');
            }
            
        });

    }
}