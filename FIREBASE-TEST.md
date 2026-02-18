# 🧪 Firebase 快速測試指南

## ⚠️ 在測試前，請先完成：

**必須設定 Firestore 安全規則！**

1. 前往：https://console.firebase.google.com/
2. 選擇專案：todo-list-app-3b98d
3. Firestore Database → 規則（Rules）
4. 貼上以下規則：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{todoId} {
      allow read, write: if true;
    }
  }
}
```

5. 點擊「發布」

---

## 🚀 快速測試（5 分鐘）

### 步驟 1：啟動本地伺服器

```bash
npx http-server -p 8080 -o
```

### 步驟 2：檢查主控台

按 F12 開啟開發者工具，應該看到：

```
✅ Service Worker 註冊成功
🔥 Firebase 初始化成功
🚀 Firebase 版本載入完成
🔄 載入待辦事項...
✅ 載入完成，共 0 個任務
```

### 步驟 3：新增第一個任務

1. 輸入「測試任務 1」
2. 點擊「新增」
3. ✅ 應該立即出現在清單中

### 步驟 4：檢查 Firebase

1. 前往 Firebase Console
2. Firestore Database → 資料
3. ✅ 應該看到 `todos` 集合
4. ✅ 裡面有一個文件

### 步驟 5：測試即時同步

1. 開啟第二個瀏覽器視窗
2. 訪問 http://localhost:8080
3. 在第一個視窗新增任務
4. ✅ 第二個視窗應該自動更新

### 步驟 6：測試所有功能

- ✅ 勾選完成
- ✅ 編輯任務
- ✅ 刪除任務
- ✅ 搜尋功能
- ✅ 拖曳排序
- ✅ 深色模式

---

## ✅ 測試通過標準

如果以下全部正常，表示 Firebase 整合成功：

- [ ] 應用程式正常載入
- [ ] 可以新增任務
- [ ] 可以編輯任務
- [ ] 可以刪除任務
- [ ] 可以切換完成狀態
- [ ] Firebase Console 顯示資料
- [ ] 兩個視窗即時同步
- [ ] 所有現有功能正常（搜尋、拖曳、主題）

---

## ❌ 如果出現錯誤

### 錯誤訊息："Missing or insufficient permissions"

**原因**：Firestore 安全規則未設定

**解決**：
1. 前往 Firebase Console
2. 設定安全規則（見上方）
3. 發布規則
4. 重新整理頁面

### 錯誤訊息："CORS error"

**原因**：使用 file:// 協定

**解決**：
- 使用 `npx http-server` 啟動本地伺服器
- 不要直接開啟 HTML 檔案

### 看不到任何錯誤，但功能不運作

**解決**：
1. 檢查瀏覽器主控台（F12 → Console）
2. 確認 Firebase 配置正確
3. 確認網路連線
4. 嘗試硬重新整理：Ctrl+Shift+R

---

## 🎉 測試成功！

如果所有測試通過，你現在有：

- 🔥 **雲端資料庫** - 資料永久保存
- 🔄 **即時同步** - 跨裝置自動更新
- 📡 **跨平台存取** - 任何裝置都能存取
- ☁️ **自動備份** - 不會因清除快取丟失資料

**準備好部署到 Vercel 了嗎？**
