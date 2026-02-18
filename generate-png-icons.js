const sharp = require('sharp');
const fs = require('fs');

// 建立 SVG 內容
const createSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.15}"/>
  <text x="${size / 2}" y="${size * 0.7}" font-size="${size * 0.55}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="bold">✓</text>
</svg>
`;

async function generateIcons() {
  try {
    // 生成 192x192
    await sharp(Buffer.from(createSVG(192)))
      .png()
      .toFile('icons/icon-192.png');
    console.log('✅ icon-192.png 已生成！');

    // 生成 512x512
    await sharp(Buffer.from(createSVG(512)))
      .png()
      .toFile('icons/icon-512.png');
    console.log('✅ icon-512.png 已生成！');

    console.log('');
    console.log('🎉 所有圖示已成功生成！');
    console.log('📁 位置：icons/icon-192.png 和 icons/icon-512.png');
  } catch (error) {
    console.error('❌ 生成圖示時發生錯誤：', error);
  }
}

generateIcons();
