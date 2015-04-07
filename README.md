# TODO LIST
ブラウザ上でToDo管理を行うアプリケーションです。

## 機能
- ToDoをリスト毎に管理
- 未完了ToDoと完了ToDoを扱うことが可能
- 期限付きToDoの管理
- キーワードによる検索が可能

## 用意したAPI
### /todolists GET
- ToDoリストの一覧を取得

### /todolist/:listId GET
- listIdに該当するToDoリストの取得

### /todolist POST
- 新規ToDoリストの作成

### /todos/:listId GET
- 該当するリストに属するToDo一覧の取得

### /todo POST
- 該当するリストにToDoを追加

### /todo/:todoId/check
- todoIdに該当するToDoのcheck属性(未完了・完了)を変更

## 使っているライブラリ
- [jQuery](http://jquery.com/)
- [Node.js](http://expressjs.com/)
- [Express](http://expressjs.com/)
- [Mongoose](http://mongoosejs.com/)
- [Jade](http://jade-lang.com/)
