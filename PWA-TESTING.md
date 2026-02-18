# PWA 功能測試指南

## ✅ PWA 實作完成！

恭喜！你的待辦事項應用現在已經是一個功能完整的 PWA（漸進式網頁應用）了！

---

## 📋 已完成的功能

### 1. Manifest 檔案 ✅
- ✅ `manifest.json` - 定義應用程式資訊
- ✅ 應用程式名稱：「待辦事項清單」
- ✅ 主題色：紫色漸層 (#667eea)

### 2. Service Worker ✅
- ✅ `sw.js` - 處理快取和離線功能
- ✅ 快取策略：Cache First (快取優先)
- ✅ 版本管理：自動清理舊快取

### 3. 應用程式圖示 ✅
- ✅ `icon-192.png` - 192x192 像素
- ✅ `icon-512.png` - 512x512 像素
- ✅ 漸層背景 + 白色勾選符號

### 4. HTML Meta 標籤 ✅
- ✅ PWA manifest 連結
- ✅ Theme color
- ✅ Apple touch icons
- ✅ Mobile web app capable

---

## 🧪 測試步驟

### 測試 1：在 Chrome DevTools 中驗證 PWA

1. **開啟應用程式**
   - 訪問：http://localhost:8080

2. **開啟 Chrome DevTools**
   - 按 `F12` 或 `Ctrl+Shift+I` (Windows/Linux)
   - 按 `Cmd+Option+I` (Mac)

3. **檢查 Application 面板**
   - 點擊頂部的 **Application** 標籤

4. **驗證 Manifest**
   - 左側選單 → **Manifest**
   - 應該看到：
     - ✅ Name: 待辦事項清單
     - ✅ Short name: Todo
     - ✅ Start URL: /
     - ✅ Theme color: #667eea
     - ✅ Icons: 192x192 和 512x512

5. **驗證 Service Worker**
   - 左側選單 → **Service Workers**
   - 應該看到：
     - ✅ Status: activated and is running
     - ✅ Source: sw.js
     - ✅ 綠色圓點（表示正在運作）

6. **檢查快取儲存**
   - 左側選單 → **Cache Storage** → **todo-v1**
   - 應該看到快取的檔案：
     - ✅ / (或 index.html)
     - ✅ script.js
     - ✅ style.css
     - ✅ manifest.json

7. **檢查主控台訊息**
   - 點擊頂部的 **Console** 標籤
   - 應該看到：
     - ✅ `✅ Service Worker 註冊成功: http://localhost:8080/`

---

### 測試 2：測試離線功能

1. **在 DevTools 中模擬離線**
   - 開啟 **Application** → **Service Workers**
   - 勾選 **Offline** 核取方塊

2. **重新整理頁面**
   - 按 `F5` 或 `Ctrl+R`
   - ✅ 應用程式應該仍然可以運作
   - ✅ 所有功能正常（新增、編輯、刪除待辦事項）

3. **檢查 Network 面板**
   - 點擊 **Network** 標籤
   - 應該看到資源來源顯示 **(ServiceWorker)**
   - 表示資源來自快取，不是網路

4. **取消離線模式**
   - 取消勾選 **Offline**
   - 確認應用程式仍然正常運作

---

### 測試 3：安裝 PWA（桌面版）

#### Chrome / Edge (Windows/Mac/Linux)

1. **查看安裝提示**
   - 在網址列右側應該會看到 **安裝** 圖示 (➕ 或 ⬇)
   - 如果沒看到，請檢查 DevTools → Application → Manifest

2. **點擊安裝**
   - 點擊網址列的安裝圖示
   - 或點擊瀏覽器選單 → **安裝待辦事項清單...**

3. **確認安裝**
   - 會彈出安裝對話框
   - 點擊 **安裝**

4. **驗證安裝成功**
   - ✅ 應用會在新視窗開啟（無瀏覽器 UI）
   - ✅ 視窗標題顯示「待辦事項清單」
   - ✅ 應用圖示顯示在工作列
   - ✅ Windows: 開始選單中出現應用程式
   - ✅ Mac: 應用程式資料夾中出現應用程式

---

### 測試 4：安裝 PWA（行動裝置）

#### Android (Chrome)

1. **在手機上訪問應用**
   - 需要部署到 Vercel 或使用 HTTPS
   - 或使用 `ngrok` 建立 HTTPS 隧道：
     ```bash
     npx ngrok http 8080
     ```

2. **安裝應用**
   - Chrome 會顯示「新增至主畫面」提示
   - 或點擊選單 (⋮) → **安裝應用程式**

3. **驗證安裝**
   - ✅ 主畫面顯示應用圖示
   - ✅ 點擊圖示以全螢幕模式開啟
   - ✅ 外觀像原生應用程式

#### iOS (Safari)

1. **在 iPhone/iPad 上訪問應用**
   - 使用 Safari 瀏覽器
   - 需要 HTTPS 網址

2. **新增至主畫面**
   - 點擊分享按鈕 (方框加箭頭)
   - 向下滾動選擇 **「加入主畫面螢幕」**
   - 點擊 **「加入」**

3. **驗證安裝**
   - ✅ 主畫面顯示應用圖示
   - ✅ 點擊圖示以全螢幕模式開啟

---

### 測試 5：測試應用圖示

1. **檢查圖示顯示**
   - 開啟 DevTools → Application → Manifest
   - 向下滾動到 **Icons** 區塊
   - 應該看到兩個圖示預覽

2. **驗證圖示設計**
   - ✅ 紫色漸層背景（#667eea → #764ba2）
   - ✅ 白色勾選符號 (✓)
   - ✅ 圓角矩形設計
   - ✅ 清晰可見

3. **在安裝後驗證**
   - 已安裝的應用應該使用自訂圖示
   - 不應該顯示預設的瀏覽器圖示

---

## 📊 驗證檢查清單

完成 PWA 實作後，你應該能夠確認以下所有項目：

### Manifest 檢查
- [ ] manifest.json 檔案存在且可存取
- [ ] 應用程式名稱和簡稱正確設定
- [ ] 主題色設定為 #667eea
- [ ] 圖示陣列包含 192x192 和 512x512 尺寸
- [ ] Display 模式設定為 "standalone"

### Service Worker 檢查
- [ ] Service Worker 成功註冊
- [ ] 狀態顯示為 "activated and running"
- [ ] 主控台顯示註冊成功訊息
- [ ] Cache Storage 包含所有必要檔案

### 離線功能檢查
- [ ] 應用在離線模式下仍可載入
- [ ] 所有 UI 功能正常運作
- [ ] localStorage 資料正常讀寫
- [ ] 深色模式切換正常
- [ ] 搜尋功能正常
- [ ] 拖曳排序正常

### 安裝檢查
- [ ] 桌面瀏覽器顯示安裝提示
- [ ] 應用可成功安裝
- [ ] 安裝後以獨立視窗開啟
- [ ] 應用圖示正確顯示
- [ ] 主題色在 UI 中正確套用

### 行動裝置檢查（選用）
- [ ] Android: 可新增至主畫面
- [ ] iOS: 可新增至主畫面螢幕
- [ ] 全螢幕模式運作
- [ ] 狀態列顏色匹配主題色

---

## 🔧 常見問題排解

### 問題 1：Service Worker 未註冊

**症狀：**
- 主控台顯示錯誤
- Application 面板中無 Service Worker

**解決方案：**
1. 確認檔案路徑：`sw.js` 必須在網站根目錄
2. 確認使用 HTTP 或 HTTPS（不支援 `file://`）
3. 檢查主控台是否有 JavaScript 錯誤
4. 嘗試硬重新整理：`Ctrl+Shift+R` (Windows) 或 `Cmd+Shift+R` (Mac)

### 問題 2：安裝按鈕未出現

**症狀：**
- 網址列沒有安裝圖示
- 選單中沒有「安裝應用程式」選項

**解決方案：**
1. 確認 Manifest 檔案正確載入
2. 確認有 Service Worker
3. 確認圖示尺寸符合要求（至少 192x192）
4. 確認 `start_url` 正確
5. Chrome 可能已經安裝過，嘗試卸載後重新安裝

### 問題 3：離線模式不運作

**症狀：**
- 離線時應用無法載入
- 顯示「無法連線到網際網路」

**解決方案：**
1. 確認 Service Worker 已啟動
2. 檢查 Cache Storage 中有檔案
3. 確認快取策略正確
4. 嘗試清除快取後重新載入：
   - DevTools → Application → Clear storage → Clear site data

### 問題 4：快取未更新

**症狀：**
- 修改程式碼後沒有反映在應用中
- 仍然看到舊版本

**解決方案：**
1. 更新 `sw.js` 中的 `CACHE_NAME`（例如：`todo-v1` → `todo-v2`）
2. 在 DevTools → Application → Service Workers 點擊 **Unregister**
3. 硬重新整理頁面：`Ctrl+Shift+R`
4. 或使用 **Update on reload** 選項（開發時推薦）

### 問題 5：圖示未正確顯示

**症狀：**
- 安裝後顯示預設圖示
- Manifest 中圖示預覽失敗

**解決方案：**
1. 確認圖示檔案存在於 `icons/` 目錄
2. 確認檔案路徑正確（使用絕對路徑：`/icons/icon-192.png`）
3. 確認圖示尺寸正確（使用線上工具驗證）
4. 重新生成圖示：`node generate-png-icons.js`
5. 清除快取並重新安裝應用

---

## 🚀 部署到 Vercel

PWA 功能在 Vercel 上會自動運作！只需：

```bash
git add .
git commit -m "Add PWA support

- Add manifest.json with app metadata
- Add Service Worker for offline support
- Add app icons (192x192 and 512x512)
- Update index.html with PWA meta tags
- Register Service Worker in script.js

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
git push
```

Vercel 會自動部署更新，使用者可以：
- ✅ 在行動裝置上安裝應用
- ✅ 在桌面安裝應用
- ✅ 離線使用應用
- ✅ 享受原生應用般的體驗

---

## 📚 下一步

PWA 第一階段已完成！你現在可以：

1. **測試所有 PWA 功能**（使用上述測試步驟）
2. **部署到 Vercel** 讓其他人使用
3. **在手機上安裝** 體驗原生應用感覺
4. **進入第二階段** 實作後端資料庫（Firebase/Supabase）

---

## 🎉 恭喜！

你已成功將待辦事項應用升級為 PWA！

**獲得的新功能：**
- 📱 可安裝到桌面和行動裝置
- 🔌 離線存取和使用
- ⚡ 更快的載入速度（快取）
- 🎨 獨立的應用視窗
- 🌟 專業的使用者體驗

這為未來的雲端同步功能奠定了完美的基礎！
