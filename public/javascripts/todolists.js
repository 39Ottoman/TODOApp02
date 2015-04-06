// ページ表示時にToDoリストを読込
$(function() {
    getTodoList();
});

// リストの作成ボタンを押すとToDoリストを追加し再表示
$('#createListButton').click(function() {
    createTodoList();
    return false;
});

// Todoリストの一覧を表示
function getTodoList() {
    var $lists = $('#lists');
    $lists.fadeOut(function() {
        $lists.children().remove();
        
        // /todolistsにGETでアクセス
        $.get('todolists', function(todoLists) {
            // 取得したToDoリストを追加
            $.each(todoLists, function(index, todoList) {
//                console.log(todoList._id);
                var listButton = '<div class="panel">'
                    + '<a href="/todopage/' + todoList._id + '">' + todoList.name + '</a></br>'
                    + 'ToDoはありません' + '</br>'
                    + '～9999年9月99日'
                    + '</div>';
                $lists.prepend(listButton);
            });
        });
    });
    $lists.fadeIn();
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
                getTodoList();
                console.log('create ' + name + '!');
                $message.text('新しいToDoリストが作成されました');
                $message.css('color', 'black');
            }
            
        });

    }
}