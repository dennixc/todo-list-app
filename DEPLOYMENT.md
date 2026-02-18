# 🚀 PWA 部署指南

## 快速部署到 Vercel

### 步驟 1：提交變更

```bash
# 查看變更
git status

# 加入所有新檔案
git add .

# 提交（包含 PWA 功能）
git commit -m "Add PWA support

- Add manifest.json with app metadata
- Add Service Worker for offline support
- Add app icons (192x192 and 512x512)
- Update index.html with PWA meta tags
- Register Service Worker in script.js

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### 步驟 2：推送到 GitHub

```bash
git push origin main
```

### 步驟 3：Vercel 自動部署

- Vercel 會自動偵測到推送
- 自動建置和部署
- 幾分鐘後就能在生產環境使用 PWA！

---

## 驗證部署成功

1. **訪問你的 Vercel 網址**
   - 例如：`https://your-app.vercel.app`

2. **開啟 Chrome DevTools**
   - 按 F12 → Application 標籤

3. **確認 PWA 功能**
   - ✅ Manifest 載入成功
   - ✅ Service Worker 運作中
   - ✅ 快取已建立
   - ✅ 顯示安裝提示

4. **在手機上測試**
   - 用手機瀏覽器訪問網址
   - 應該會提示「新增至主畫面」
   - 安裝後可離線使用

---

## 本地測試

如果想在推送前本地測試：

```bash
# 啟動本地伺服器
npx http-server -p 8080

# 在瀏覽器開啟
# http://localhost:8080
```

按照 `PWA-TESTING.md` 中的測試步驟驗證功能。

---

## 檔案清單

部署時會包含以下新檔案：

```
manifest.json           - PWA 設定檔
sw.js                   - Service Worker
icons/
  ├── icon-192.png      - 小圖示
  ├── icon-512.png      - 大圖示
  └── README.md         - 圖示說明
```

修改的檔案：

```
index.html              - 加入 PWA meta 標籤
script.js               - 註冊 Service Worker
.gitignore              - 排除 node_modules
```

**注意：** 以下檔案不會被部署（已在 .gitignore）：
- `node_modules/` - npm 套件
- `package-lock.json` - 套件鎖定檔案
- `generate-*.js` - 圖示生成腳本（只用於開發）

---

## 🎉 完成！

部署後，你的待辦事項應用就是一個完整的 PWA 了！

使用者可以：
- 📱 在手機主畫面安裝應用
- 💻 在電腦上安裝應用
- 🔌 離線使用
- ⚡ 享受快速載入
