// 全域變數
let todos = [];
let draggedElement = null;
let draggedId = null;

// DOM 元素
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const searchInput = document.getElementById('searchInput');

// 初始化 - 頁面載入時執行
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    renderTodos();
    loadTheme();

    // 事件監聽器
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    themeToggle.addEventListener('click', toggleTheme);
    searchInput.addEventListener('input', handleSearch);
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

    // 清空搜尋框以顯示所有任務（包括新增的）
    searchInput.value = '';
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
function renderTodos(searchQuery = '') {
    // 清空列表
    todoList.innerHTML = '';

    // 如果沒有任務，顯示提示
    if (todos.length === 0) {
        todoList.innerHTML = '<div class="empty-state">目前沒有待辦事項<br>開始新增一個吧！</div>';
        return;
    }

    // 根據搜尋條件過濾任務
    const filteredTodos = todos.filter(todo =>
        todo.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 如果搜尋結果為空，顯示提示
    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<div class="empty-state">🔍 找不到符合的任務<br>試試其他關鍵字吧！</div>';
        return;
    }

    // 為每個任務建立 DOM 元素
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.setAttribute('data-id', todo.id);
        li.setAttribute('draggable', 'true');

        // 拖曳事件監聽器
        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('drop', handleDrop);
        li.addEventListener('dragend', handleDragEnd);
        li.addEventListener('dragenter', handleDragEnter);
        li.addEventListener('dragleave', handleDragLeave);

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

// 載入主題設定
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        themeIcon.textContent = '🌙';
    }
}

// 切換主題
function toggleTheme() {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

// 處理搜尋
function handleSearch() {
    const searchQuery = searchInput.value;
    renderTodos(searchQuery);
}

// 拖曳開始
function handleDragStart(e) {
    draggedElement = this;
    draggedId = parseInt(this.getAttribute('data-id'));
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

// 拖曳經過
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

// 拖曳進入
function handleDragEnter(e) {
    if (this !== draggedElement) {
        this.classList.add('drag-over');
    }
}

// 拖曳離開
function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

// 放下
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (draggedElement !== this) {
        // 獲取拖曳的任務和目標任務的 ID
        const targetId = parseInt(this.getAttribute('data-id'));

        // 找到兩個任務在陣列中的索引
        const draggedIndex = todos.findIndex(todo => todo.id === draggedId);
        const targetIndex = todos.findIndex(todo => todo.id === targetId);

        // 重新排序：移除拖曳的項目，插入到新位置
        const [draggedItem] = todos.splice(draggedIndex, 1);
        todos.splice(targetIndex, 0, draggedItem);

        // 儲存並重新渲染
        saveTodos();
        renderTodos(searchInput.value);
    }

    return false;
}

// 拖曳結束
function handleDragEnd(e) {
    // 移除所有拖曳相關的 class
    const items = document.querySelectorAll('.todo-item');
    items.forEach(item => {
        item.classList.remove('dragging');
        item.classList.remove('drag-over');
    });

    draggedElement = null;
    draggedId = null;
}
