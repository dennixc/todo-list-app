# 🚀 快速開始指南

## 已完成任務自動排序功能

### ⚡ 快速啟用（3 個步驟）

#### 步驟 1: 開啟應用程式
打開 `index.html` 在瀏覽器中

#### 步驟 2: 執行資料遷移
1. 按 `F12` 開啟開發者工具
2. 切換到 `Console` 標籤
3. 貼上以下程式碼並按 Enter：

```javascript
async function migrateTodos() {
    const firebase = window.firebaseDB;
    if (!firebase) {
        console.error('❌ Firebase 尚未初始化，請稍後再試');
        return;
    }
    const { db, collection, getDocs, doc, updateDoc } = firebase;
    const todosCollection = collection(db, 'todos');
    const snapshot = await getDocs(todosCollection);
    console.log(`📊 找到 ${snapshot.size} 個任務`);
    const updates = [];
    snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (!data.hasOwnProperty('completedAt')) {
            const todoRef = doc(db, 'todos', docSnap.id);
            updates.push(updateDoc(todoRef, {
                completedAt: data.completed ? (data.createdAt || new Date()) : null,
                order: data.order ?? 0
            }));
        }
    });
    if (updates.length === 0) {
        console.log('✅ 無需遷移');
        return;
    }
    await Promise.all(updates);
    console.log(`✅ 成功遷移 ${updates.length} 個任務！`);
}
migrateTodos();
```

#### 步驟 3: 重新整理頁面
按 `F5` 或 `Ctrl+R` 重新載入頁面

---

## ✨ 新功能說明

### 1️⃣ 自動排序
- **未完成任務**：自動顯示在列表上方
- **已完成任務**：自動顯示在列表下方

### 2️⃣ 智能切換
- 勾選任務 → 自動移到下方
- 取消勾選 → 自動移回上方

### 3️⃣ 拖曳排序
- ✅ 可以在同一狀態內拖曳排序
- ❌ 無法跨狀態拖曳（會顯示提示）

---

## 🎯 使用範例

### 視覺效果

**排序前**（混亂）：
```
☑ 洗衣服
☐ 買菜
☑ 繳水電費
☐ 寫報告
```

**排序後**（自動整理）：
```
☐ 買菜          ← 未完成區域
☐ 寫報告
─────────────────
☑ 繳水電費      ← 已完成區域（最近完成的在前）
☑ 洗衣服
```

---

## ❓ 常見問題

### Q1: 遷移腳本執行後沒反應？
**A**: 重新整理頁面（F5）即可看到效果

### Q2: 可以將已完成任務拖回未完成區域嗎？
**A**: 不能直接拖曳，但可以取消勾選，任務會自動移回未完成區域

### Q3: 多設備會同步嗎？
**A**: 會！所有設備都會自動更新排序

### Q4: 需要重新執行遷移嗎？
**A**: 不需要，只需執行一次。之後新增的任務會自動包含新欄位

---

## 📞 需要幫助？

如遇到問題，請檢查：
1. ✅ 是否已執行資料遷移腳本
2. ✅ 是否已重新整理頁面
3. ✅ 瀏覽器 Console 是否有錯誤訊息

查看完整實作細節：`IMPLEMENTATION-SUMMARY.md`
