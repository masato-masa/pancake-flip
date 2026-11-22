# ひっくりパンケーキ

縦に積まれたパンケーキ（大きさ 1〜n）を、1 枚をタップして「そこから上をまとめてひっくり返す」だけで、上から小さい順に並べるパズル。最少手数（par）はソルバー（幅優先探索）で証明し、最少の手順はどの面もちょうど 1 本。Claude が 0 から考えた 5 作目。

- 公開: https://masato-masa.github.io/pancake-flip/
- 面は 4 ワールド × 4 面。`npm run levels`（枚数と最少手数を決めて探索）→ `npm test`（par 一致・最少の手順が 1 本・最初の最善手が「全部ひっくり返す」でない、を全面で再検証）。
- 絵素材は使わない（図形・数字・色だけ）。アイコンは `scripts/build-icons.mjs` がコードで描く。
- `npm run dev` / `npm run build` / `npm run deploy`
