# 應用程式圖示

## 需要的圖示尺寸

- `icon-192.png` - 192x192 像素
- `icon-512.png` - 512x512 像素

## 快速建立圖示的方法

### 方法 1：使用線上工具（推薦）

訪問以下任一網站上傳你的圖片並生成 PWA 圖示：

1. **PWA Asset Generator**
   - 網址：https://www.pwabuilder.com/imageGenerator
   - 上傳一張 512x512 的圖片，自動生成所有尺寸

2. **Favicon Generator**
   - 網址：https://realfavicongenerator.net/
   - 生成完整的圖示套件

3. **Canva**（設計圖示）
   - 網址：https://www.canva.com/
   - 建立自訂圖示設計

### 方法 2：使用現有圖片轉換

如果你有一張圖片，可以使用以下工具調整尺寸：

- **線上圖片編輯器**：https://www.iloveimg.com/resize-image
- **Squoosh**：https://squoosh.app/（Google 的圖片壓縮工具）

### 方法 3：使用 Node.js 腳本生成簡單圖示

在專案目錄執行以下命令（需要安裝 Node.js）：

```bash
npm install sharp
```

建立 `generate-icons.js`：

```javascript
const sharp = require('sharp');

// 建立一個簡單的彩色方塊作為圖示
const svg = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#grad)" rx="80"/>
  <text x="256" y="320" font-size="280" text-anchor="middle" fill="white" font-family="Arial">✓</text>
</svg>
`;

// 生成 192x192
sharp(Buffer.from(svg))
  .resize(192, 192)
  .png()
  .toFile('icons/icon-192.png');

// 生成 512x512
sharp(Buffer.from(svg))
  .resize(512, 512)
  .png()
  .toFile('icons/icon-512.png');

console.log('圖示生成完成！');
```

執行：`node generate-icons.js`

### 臨時解決方案

如果你暫時不想建立圖示，可以：

1. 從網路下載兩張免費的 PNG 圖片
2. 重新命名為 `icon-192.png` 和 `icon-512.png`
3. 放到 `icons/` 目錄

**免費圖示網站：**
- https://www.flaticon.com/
- https://icons8.com/
- https://www.iconfinder.com/

## 設計建議

- 使用簡單、清晰的圖示
- 建議使用與應用主題色（#667eea）相關的顏色
- 避免過多細節（在小尺寸下會模糊）
- 可以使用 ✓ 或 ✅ 符號代表待辦事項應用
