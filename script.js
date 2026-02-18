// 全域變數
let todos = [];

// DOM 元素
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

// 初始化 - 頁面載入時執行
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    renderTodos();

    // 事件監聽器
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
});

// 從 localStorage 載入資料
function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        try {
            todos = JSON.parse(savedTodos);
        } catch (e) {
            console.error('載入資料時發生錯誤:', e);
            todos = [];
        }
    }
}

// 儲存資料到 localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 新增任務
function addTodo() {
    const text = todoInput.value.trim();

    // 驗證輸入不為空
    if (text === '') {
        alert('請輸入待辦事項！');
        return;
    }

    // 建立新任務物件
    const newTodo = {
        id: Date.now(), // 使用時間戳作為唯一 ID
        text: text,
        completed: false
    };

    // 加入陣列
    todos.push(newTodo);

    // 儲存並渲染
    saveTodos();
    renderTodos();

    // 清空輸入框
    todoInput.value = '';
    todoInput.focus();
}

// 刪除任務
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// 切換完成狀態
function toggleComplete(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// 編輯任務
function editTodo(id) {
    const todo = todos.find(todo => todo.id === id);
    if (!todo) return;

    const todoItem = document.querySelector(`[data-id="${id}"]`);
    const textSpan = todoItem.querySelector('.todo-text');
    const editBtn = todoItem.querySelector('.edit-btn');

    // 建立輸入框
    const input = document.createElement('input');
    input.type = 'text';
    input.value = todo.text;
    input.className = 'todo-text editing';

    // 替換文字為輸入框
    textSpan.replaceWith(input);
    input.focus();
    input.select();

    // 變更按鈕文字
    editBtn.textContent = '儲存';
    editBtn.onclick = () => saveTodoEdit(id, input);

    // Enter 鍵儲存
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveTodoEdit(id, input);
        }
    });

    // Escape 鍵取消
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            renderTodos();
        }
    });

    // 點擊外部儲存
    input.addEventListener('blur', () => {
        setTimeout(() => saveTodoEdit(id, input), 200);
    });
}

// 儲存編輯後的任務
function saveTodoEdit(id, input) {
    const newText = input.value.trim();

    if (newText === '') {
        alert('任務內容不能為空！');
        input.focus();
        return;
    }

    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.text = newText;
        saveTodos();
        renderTodos();
    }
}

// 渲染任務列表
function renderTodos() {
    // 清空列表
    todoList.innerHTML = '';

    // 如果沒有任務，顯示提示
    if (todos.length === 0) {
        todoList.innerHTML = '<div class="empty-state">目前沒有待辦事項<br>開始新增一個吧！</div>';
        return;
    }

    // 為每個任務建立 DOM 元素
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.setAttribute('data-id', todo.id);

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleComplete(todo.id));

        // 任務文字
        const textSpan = document.createElement('span');
        textSpan.className = `todo-text ${todo.completed ? 'completed' : ''}`;
        textSpan.textContent = todo.text;

        // 編輯按鈕
        const editBtn = document.createElement('button');
        editBtn.className = 'btn edit-btn';
        editBtn.textContent = '編輯';
        editBtn.onclick = () => editTodo(todo.id);

        // 刪除按鈕
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn delete-btn';
        deleteBtn.textContent = '刪除';
        deleteBtn.onclick = () => {
            if (confirm('確定要刪除這個任務嗎？')) {
                deleteTodo(todo.id);
            }
        };

        // 組合元素
        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
    });
}
