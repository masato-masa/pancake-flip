import { defineConfig } from 'vite';

// GitHub Pages のプロジェクトページは /pancake-flip/ 配下。本番ビルドだけベースパスを付ける。
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/pancake-flip/' : '/',
}));
