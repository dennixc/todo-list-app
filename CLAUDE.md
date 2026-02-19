# Todo List App - Claude Code 指引

## 專案概述
待辦事項 PWA 應用，支援 Firebase 雲端同步、拖曳排序、深色模式。
- **線上版本**：Vercel 自動部署（連接 GitHub main 分支）
- **技術架構**：Vue 3 + Vite + Tailwind CSS v4 + Firebase SDK v10

## ⚠️ 重要注意事項

### 核心文件在 src/ 目錄
- `src/main.js` — Vue app entry point
- `src/App.vue` — Root component（主題切換、搜尋狀態）
- `src/style.css` — Tailwind CSS v4 + iOS 自訂樣式
- `src/firebase.js` — Firebase 初始化（npm 包）
- `src/composables/useFirestore.js` — 所有 Firebase 操作邏輯
- `src/components/TodoList.vue` — 列表 + SortableJS 拖曳
- `src/components/TodoItem.vue` — 單項：checkbox、inline edit、左滑刪除
- `src/components/AddTodoBar.vue` — 底部固定新增欄

### 舊文件（已停用，可忽略）
- `script-cdn.js` — 舊版 Vanilla JS（不再使用）
- `style.css`（根目錄）— 舊版 CSS（不再使用）

## 技術架構
- **前端**：Vue 3 + Vite 6
- **樣式**：Tailwind CSS v4 + 自訂 iOS 風格 CSS
- **拖曳**：SortableJS（handle: `.drag-handle`）
- **資料庫**：Firebase Firestore（npm 包，非 CDN）
- **部署**：Vercel（git push → `npm run build` → 輸出 `dist/`）
- **離線**：Service Worker（`public/sw.js`）

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
- 排序在 `useFirestore.js` 的 `sortedTodos` computed 屬性內

## 開發指令
```bash
npm run dev     # 本地開發 (localhost:5173)
npm run build   # 生產 build (輸出 dist/)
npm run preview # 預覽 build 結果
```

## 部署流程
```bash
git add [files]
git commit -m "說明"
git push origin main
# Vercel 自動執行 npm run build，部署 dist/ 資料夾，2-3 分鐘後生效
```

## 已完成功能
- ✅ Firebase 即時同步（多設備）
- ✅ 自動排序（已完成任務移到下層）
- ✅ 拖曳排序（SortableJS，桌面 + 手機，限 `.drag-handle`）
- ✅ 左滑刪除（手機 iOS 原生風格）
- ✅ Inline 編輯（點擊文字直接編輯，替換舊版 prompt()）
- ✅ PWA 離線支援（public/sw.js）
- ✅ 深色/淺色模式（iOS 系統風格）
- ✅ 搜尋過濾
- ✅ iOS Safe Area 適配（Dynamic Island / Home Bar）
- ✅ Apple Reminders 風格 UI（大粗體紫色標題、圓形 checkbox）

## 未來方向
- [ ] 視覺分隔線（未完成/已完成之間）
- [ ] 批量標記完成
- [ ] 任務分類/標籤
- [ ] 優先級排序
