# Todo List App - Claude Code 指引

## 專案概述
待辦事項 PWA 應用，支援 Firebase 雲端同步、拖曳排序、深色模式。
- **線上版本**：Vercel 自動部署（連接 GitHub main 分支）

## ⚠️ 重要注意事項

### 主要文件是 script-cdn.js，不是 script.js
- `script-cdn.js` — **唯一使用中的 JS 文件**（index.html 載入此文件）
- `script.js` — 舊版本（有 ES Module import，未使用）
- 所有修改只需改 `script-cdn.js`

## 核心文件
| 文件 | 說明 |
|------|------|
| `index.html` | 主頁面（含 Firebase CDN 初始化） |
| `script-cdn.js` | 主應用邏輯（唯一需要修改的 JS） |
| `style.css` | 樣式 |
| `sw.js` | Service Worker（PWA 離線快取） |
| `manifest.json` | PWA 設定 |
| `migrate-todos.js` | 資料遷移腳本（只需執行一次） |

## 技術架構
- **前端**：Vanilla JavaScript（無框架）
- **資料庫**：Firebase Firestore（即時同步）
- **部署**：Vercel（git push → 自動部署，2-3 分鐘）
- **離線**：Service Worker + Cache API

## Firebase 資料結構
```javascript
// Collection: todos
{
  text: string,           // 任務文字
  completed: boolean,     // 完成狀態
  createdAt: Date,        // 建立時間
  order: number,          // 排序順序（手動拖曳）
  completedAt: Date|null  // 完成時間（null = 未完成）
}
```

## 排序邏輯
- 未完成任務（completed: false）→ 顯示在上層，按 order 排序
- 已完成任務（completed: true）→ 顯示在下層，按 completedAt 倒序
- 排序在 `sortTodosByCompletionStatus()` 函數內（script-cdn.js 第 350 行）

## 部署流程
```bash
git add [files]
git commit -m "說明"
git push origin main
# Vercel 自動部署，2-3 分鐘後生效
```

## 已完成功能
- ✅ Firebase 即時同步（多設備）
- ✅ 自動排序（已完成任務移到下層）
- ✅ 拖曳排序（桌面 + 手機，限同狀態）
- ✅ PWA 離線支援
- ✅ 深色/淺色模式
- ✅ 搜尋過濾

## 未來方向
- [ ] 視覺分隔線（未完成/已完成之間）
- [ ] 批量標記完成
- [ ] 任務分類/標籤
- [ ] 優先級排序
