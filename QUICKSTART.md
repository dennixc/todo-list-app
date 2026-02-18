# 🚀 快速啟動指南

## 立即測試 PWA 功能

### 方法 1：本地測試（推薦）

```bash
# 在專案目錄執行
npx http-server -p 8080 -o
```

瀏覽器會自動開啟 http://localhost:8080

### 方法 2：使用 Python

```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

然後訪問 http://localhost:8080

---

## 📋 快速驗證清單

在瀏覽器中開啟應用後：

### 1. 基本功能測試（30 秒）
- [ ] 新增一個待辦事項
- [ ] 勾選完成
- [ ] 切換深色模式
- [ ] 搜尋功能

### 2. PWA 功能測試（1 分鐘）

**按 F12 開啟 DevTools：**

- [ ] **Application** → **Manifest**
  - 應該看到「待辦事項清單」
  - 主題色：#667eea

- [ ] **Application** → **Service Workers**
  - 狀態：activated and running ✅

- [ ] **Application** → **Cache Storage** → **todo-v1**
  - 看到快取的檔案 ✅

- [ ] **Console**
  - 看到「✅ Service Worker 註冊成功」

### 3. 離線測試（1 分鐘）

- [ ] 在 **Application** → **Service Workers** 勾選 **Offline**
- [ ] 按 F5 重新整理
- [ ] 應用仍然運作 ✅
- [ ] 所有功能正常 ✅

### 4. 安裝測試（1 分鐘）

- [ ] 查看網址列右側的 **安裝** 圖示 (➕)
- [ ] 點擊安裝
- [ ] 應用在獨立視窗開啟 ✅
- [ ] 查看圖示是否正確顯示 ✅

---

## 🎯 如果一切正常

恭喜！你的 PWA 已成功實作！

### 下一步：

1. **部署到 Vercel**
   ```bash
   git add .
   git commit -m "Add PWA support"
   git push
   ```

2. **在手機上測試**
   - 訪問 Vercel 網址
   - 點擊「新增至主畫面」
   - 享受原生應用體驗！

---

## ❌ 如果遇到問題

### Service Worker 未註冊？

```bash
# 確認使用 HTTP/HTTPS（不是 file://）
# 確認沒有 JavaScript 錯誤
# 嘗試硬重新整理：Ctrl+Shift+R
```

### 安裝按鈕未出現？

```bash
# 可能已經安裝過
# 嘗試在隱私模式測試
# 確認 Manifest 正確載入
```

### 快取未生效？

```bash
# DevTools → Application → Clear storage
# 點擊 "Clear site data"
# 重新載入頁面
```

---

## 📚 詳細文件

- **完整測試指南**：`PWA-TESTING.md`
- **部署說明**：`DEPLOYMENT.md`
- **功能總結**：`PWA-SUMMARY.md`
- **專案說明**：`README-PWA.md`

---

**預計測試時間：5 分鐘**

**難度等級：⭐ 簡單**

**需要的工具：現代瀏覽器（Chrome 推薦）**
