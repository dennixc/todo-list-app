// 簡單的圖示生成腳本（使用 Canvas API）
// 如果沒有 sharp，可以使用這個替代方案

const fs = require('fs');

// 建立 SVG 圖示
const svg192 = `
<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="192" height="192" fill="url(#grad)" rx="30"/>
  <text x="96" y="135" font-size="110" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="bold">✓</text>
</svg>
`;

const svg512 = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#grad)" rx="80"/>
  <text x="256" y="360" font-size="300" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="bold">✓</text>
</svg>
`;

// 儲存 SVG 檔案（瀏覽器可以直接使用 SVG）
fs.writeFileSync('icons/icon-192.svg', svg192);
fs.writeFileSync('icons/icon-512.svg', svg512);

console.log('✅ SVG 圖示已生成！');
console.log('📁 位置：icons/icon-192.svg 和 icons/icon-512.svg');
console.log('');
console.log('下一步：');
console.log('1. 使用線上工具將 SVG 轉換為 PNG：');
console.log('   - https://convertio.co/zh/svg-png/');
console.log('   - https://cloudconvert.com/svg-to-png');
console.log('2. 或安裝 sharp：npm install sharp');
console.log('3. 將轉換後的檔案命名為 icon-192.png 和 icon-512.png');
