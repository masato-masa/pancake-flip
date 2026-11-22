// アイコンと棚の表紙。絵素材は使わず、図形（大きさのちがうパンケーキの山）だけをコードで描く（ChatGPT 製ではない）。
// ChatGPT が使えるようになったら、assets-src/ に絵を置いて差し替える。  node scripts/build-icons.mjs [--cover=出力パス]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');
const rows = [[34, '2'], [58, '5'], [46, '3'], [84, '6'], [66, '4']];
const bars = rows
  .map(([w, t], i) => {
    const x = 100 - w; // 幅 2w の棒を中央に
    const y = 22 + i * 32;
    return `<rect x="${x}" y="${y}" width="${w * 2}" height="26" rx="13" fill="#e9b565" stroke="#9a6428" stroke-width="3"/>
    <text x="100" y="${y + 19}" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="800" fill="#5a3a14" text-anchor="middle">${t}</text>`;
  })
  .join('');
const svg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f6f5ef"/>${bars}</svg>`;
for (const [size, name] of [[192, 'icon-192.png'], [512, 'icon-512.png'], [180, 'apple-touch-icon.png'], [64, 'favicon.png']]) {
  await sharp(Buffer.from(svg(size))).png({ compressionLevel: 9 }).toFile(`public/${name}`);
}
const cover = process.argv.find((a) => a.startsWith('--cover='));
if (cover) await sharp(Buffer.from(svg(200))).webp({ quality: 82 }).toFile(cover.slice(8));
console.log('icons done');
