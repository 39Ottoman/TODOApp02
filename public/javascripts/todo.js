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
        
        // /todolistにGETでアクセス
        $.get('todolist', function(todoLists) {
            // 取得したToDoリストを追加
            $.each(todoLists, function(index, todoList) {
                console.log(todoList._id);
                var listButton = '<div class="panel">'
                + '<a href="#">' + todoList.name + '</a></br>'
                + 'ToDoはありません' + '</br>'
                + '～9999年9月99日'
                + '</div>';
                $lists.append(listButton);
            });
        });
    });
    $lists.fadeIn();
}

// 新しいToDoリストを作成+再表示
function createTodoList() {
    var name = $('#newListName').val();
    
    // 入力項目を空にする
    $('#newListName').val('');
    // /todolistにPOSTでアクセス
    $.post('/todolist', {name: name}, function(res) {
        console.log(res);
        getTodoList();
    });
    
    console.log('create ' + name + '!');
}