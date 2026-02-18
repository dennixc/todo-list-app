// ==========================================
// Firebase 整合版本的待辦事項應用 (CDN 版本)
// 使用全域變數 window.firebaseDB
// ==========================================

// 等待 Firebase 初始化
function waitForFirebase() {
    return new Promise((resolve) => {
        if (window.firebaseDB) {
            resolve();
        } else {
            const checkInterval = setInterval(() => {
                if (window.firebaseDB) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        }
    });
}

// 從全域取得 Firebase 函數
let db, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy;

waitForFirebase().then(() => {
    const firebase = window.firebaseDB;
    db = firebase.db;
    collection = firebase.collection;
    addDoc = firebase.addDoc;
    getDocs = firebase.getDocs;
    doc = firebase.doc;
    updateDoc = firebase.updateDoc;
    deleteDoc = firebase.deleteDoc;
    onSnapshot = firebase.onSnapshot;
    query = firebase.query;
    orderBy = firebase.orderBy;

    console.log('🚀 Firebase 版本載入完成');

    // 初始化應用
    initApp();
});

// ==========================================
// PWA - Service Worker 註冊
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('✅ Service Worker 註冊成功:', registration.scope);

                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('🔄 Service Worker 更新中...');

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('📢 新版本可用！請重新整理頁面以更新。');
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('❌ Service Worker 註冊失敗:', error);
            });
    });
}

// ==========================================
// 全域變數
// ==========================================
let todos = [];
let draggedElement = null;
let draggedId = null;
let touchStartY = 0;
let touchCurrentY = 0;
let isDraggingTouch = false;
let unsubscribe = null;

// ==========================================
// DOM 元素
// ==========================================
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const searchInput = document.getElementById('searchInput');
const loadingIndicator = document.getElementById('loadingIndicator');

// ==========================================
// 初始化函數
// ==========================================
async function initApp() {
    await loadTodos();
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
}

// ==========================================
// Firebase 資料操作函數
// ==========================================

function showLoading() {
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
    }
}

function hideLoading() {
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    const container = document.querySelector('.container');
    container.insertBefore(errorDiv, todoList);

    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

async function loadTodos() {
    try {
        showLoading();
        console.log('🔄 載入待辦事項...');

        const todosCollection = collection(db, 'todos');
        const q = query(todosCollection, orderBy('createdAt', 'desc'));

        unsubscribe = onSnapshot(q, (snapshot) => {
            todos = [];
            snapshot.forEach((docSnap) => {
                todos.push({
                    id: docSnap.id,
                    ...docSnap.data()
                });
            });

            console.log('✅ 載入完成，共', todos.length, '個任務');
            renderTodos();
            hideLoading();
        }, (error) => {
            console.error('❌ 載入失敗:', error);
            showError('載入資料失敗，請檢查網路連線');
            hideLoading();
        });

    } catch (error) {
        console.error('❌ Firestore 錯誤:', error);
        showError('無法連接到資料庫');
        hideLoading();
    }
}

async function addTodo() {
    const text = todoInput.value.trim();

    if (text === '') {
        alert('請輸入待辦事項！');
        return;
    }

    try {
        addBtn.disabled = true;
        addBtn.textContent = '新增中...';

        await addDoc(collection(db, 'todos'), {
            text: text,
            completed: false,
            createdAt: new Date(),
            order: todos.length
        });

        console.log('✅ 任務已新增');
        todoInput.value = '';

    } catch (error) {
        console.error('❌ 新增失敗:', error);
        showError('新增任務失敗，請稍後再試');
    } finally {
        addBtn.disabled = false;
        addBtn.textContent = '新增';
    }
}

async function toggleTodo(id) {
    try {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        const todoRef = doc(db, 'todos', id);
        await updateDoc(todoRef, {
            completed: !todo.completed
        });

        console.log('✅ 狀態已更新');

    } catch (error) {
        console.error('❌ 更新失敗:', error);
        showError('更新狀態失敗');
    }
}

async function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const newText = prompt('編輯待辦事項：', todo.text);

    if (newText === null || newText.trim() === '') {
        return;
    }

    try {
        const todoRef = doc(db, 'todos', id);
        await updateDoc(todoRef, {
            text: newText.trim()
        });

        console.log('✅ 編輯成功');

    } catch (error) {
        console.error('❌ 編輯失敗:', error);
        showError('編輯任務失敗');
    }
}

async function deleteTodo(id) {
    if (!confirm('確定要刪除這個待辦事項嗎？')) {
        return;
    }

    try {
        await deleteDoc(doc(db, 'todos', id));
        console.log('✅ 刪除成功');

    } catch (error) {
        console.error('❌ 刪除失敗:', error);
        showError('刪除任務失敗');
    }
}

function renderTodos(filter = '') {
    todoList.innerHTML = '';

    const filteredTodos = todos.filter(todo =>
        todo.text.toLowerCase().includes(filter.toLowerCase())
    );

    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<li class="todo-item" style="text-align: center; color: var(--text-secondary);">目前沒有待辦事項</li>';
        return;
    }

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        li.innerHTML = `
            <span class="drag-handle" title="拖曳排序">☰</span>
            <input
                type="checkbox"
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo('${todo.id}')"
            >
            <span class="todo-text ${todo.completed ? 'completed' : ''}">${escapeHtml(todo.text)}</span>
            <div class="todo-actions">
                <button class="edit-btn" onclick="editTodo('${todo.id}')" title="編輯">✏️</button>
                <button class="delete-btn" onclick="deleteTodo('${todo.id}')" title="刪除">🗑️</button>
            </div>
        `;

        // 只在拖曳手柄上啟用拖曳
        const dragHandle = li.querySelector('.drag-handle');
        dragHandle.draggable = true;

        // 拖曳手柄的事件（桌面）
        dragHandle.addEventListener('dragstart', handleDragStart);

        // 項目的拖曳目標事件
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('drop', handleDrop);
        li.addEventListener('dragend', handleDragEnd);

        // 觸控事件（手機）- 只綁定在拖曳手柄上
        dragHandle.addEventListener('touchstart', handleTouchStart, { passive: false });
        dragHandle.addEventListener('touchmove', handleTouchMove, { passive: false });
        dragHandle.addEventListener('touchend', handleTouchEnd);

        todoList.appendChild(li);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function handleSearch(e) {
    const searchTerm = e.target.value.trim();
    renderTodos(searchTerm);
}

// ==========================================
// 拖曳排序功能
// ==========================================

function handleDragStart(e) {
    // e.target 是拖曳手柄，需要找到父元素 todo-item
    draggedElement = e.target.closest('.todo-item');
    draggedId = draggedElement.dataset.id;
    draggedElement.style.opacity = '0.4';
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const target = e.target.closest('.todo-item');
    if (target && target !== draggedElement) {
        target.classList.add('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();

    const target = e.target.closest('.todo-item');
    if (!target || target === draggedElement) return;

    target.classList.remove('drag-over');

    const draggedIndex = todos.findIndex(t => t.id === draggedId);
    const targetIndex = todos.findIndex(t => t.id === target.dataset.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [removed] = todos.splice(draggedIndex, 1);
    todos.splice(targetIndex, 0, removed);

    renderTodos();
}

function handleDragEnd(e) {
    // e.target 是拖曳手柄，需要找到父元素
    const todoItem = e.target.closest('.todo-item');
    if (todoItem) {
        todoItem.style.opacity = '1';
    }
    document.querySelectorAll('.todo-item').forEach(item => {
        item.classList.remove('drag-over');
    });
}

function handleTouchStart(e) {
    // 現在事件已經只綁定在拖曳手柄上，不需要再檢查
    const touch = e.touches[0];
    touchStartY = touch.clientY;
    draggedElement = e.target.closest('.todo-item');
    draggedId = draggedElement.dataset.id;
    isDraggingTouch = false;
}

function handleTouchMove(e) {
    if (!draggedElement) return;

    const touch = e.touches[0];
    touchCurrentY = touch.clientY;
    const deltaY = touchCurrentY - touchStartY;

    // 增加觸發閾值到 20px，避免誤觸
    if (Math.abs(deltaY) > 20) {
        isDraggingTouch = true;
        e.preventDefault();
        draggedElement.style.transform = `translateY(${deltaY}px)`;
        draggedElement.style.opacity = '0.8';
    }

    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetItem = targetElement?.closest('.todo-item');

    document.querySelectorAll('.todo-item').forEach(item => {
        item.classList.remove('drag-over');
    });

    if (targetItem && targetItem !== draggedElement) {
        targetItem.classList.add('drag-over');
    }
}

function handleTouchEnd(e) {
    if (!isDraggingTouch || !draggedElement) {
        draggedElement = null;
        return;
    }

    const touch = e.changedTouches[0];
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetItem = targetElement?.closest('.todo-item');

    if (targetItem && targetItem !== draggedElement) {
        const draggedIndex = todos.findIndex(t => t.id === draggedId);
        const targetIndex = todos.findIndex(t => t.id === targetItem.dataset.id);

        if (draggedIndex !== -1 && targetIndex !== -1) {
            const [removed] = todos.splice(draggedIndex, 1);
            todos.splice(targetIndex, 0, removed);
        }
    }

    draggedElement.style.transform = '';
    draggedElement.style.opacity = '1';
    document.querySelectorAll('.todo-item').forEach(item => {
        item.classList.remove('drag-over');
    });

    draggedElement = null;
    isDraggingTouch = false;
    renderTodos();
}

// ==========================================
// 主題切換功能
// ==========================================

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');

    themeIcon.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
}

// ==========================================
// 將函數暴露到全域作用域
// ==========================================
window.toggleTodo = toggleTodo;
window.editTodo = editTodo;
window.deleteTodo = deleteTodo;

// ==========================================
// 清理函數
// ==========================================
window.addEventListener('beforeunload', () => {
    if (unsubscribe) {
        unsubscribe();
    }
});
