// 面を「手筋を先に決めて」探す。ワールドごとの手筋（SPEC）と枚数・最少手数を決め、スロット番号をシードにした決定的な乱数で並びを探し、
// 「最少の手順がちょうど 1 本」を確かめて src/levels.json に書く。
//   node --experimental-strip-types scripts/gen-levels.ts
import { writeFileSync } from 'node:fs';
import { flip, isSorted, parOf, waysOf, table } from '../src/engine.ts';

const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return (): number => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

interface Spec {
  name: string;
  trick: string;
  /** 面ごとの [枚数, 最少手数] */
  levels: [number, number][];
  /** 最初の最善手が「いちばん下（k = n）」でないこと（全部ひっくり返すのが答えだと簡単すぎる） */
  notFlipAll?: boolean;
  /** 最少手数の手順の途中で、一度「ソート済みから遠ざかる」手がある（目先で良く見えない手を使う） */
  detour?: boolean;
}

const SPEC: Spec[] = [
  { name: 'ひっくり返す', trick: '1 枚を選ぶと、そのパンケーキと上の全部がまとめてひっくり返る。いちばん大きいのを下へ運ぶ', levels: [[4, 2], [4, 3], [5, 3], [5, 4]], notFlipAll: true },
  { name: 'もどして ひっくり返す', trick: '大きいのを下に運んだら、そこは触らない。残りの山で同じことを繰り返す', levels: [[5, 4], [6, 4], [6, 5], [6, 5]], notFlipAll: true },
  { name: 'とおまわり', trick: '一度崩してから揃える。目先で良く見える手が、最少の手順ではない', levels: [[6, 6], [7, 6], [7, 7], [7, 7]], notFlipAll: true },
  { name: 'ながい みち', trick: '8 枚。最少の手順は 1 本しかない（8 枚で最も長い 8 手）。先を読んで、順番をまちがえない', levels: [[8, 7], [8, 8], [8, 8], [8, 8]], notFlipAll: true },
];

function find(n: number, par: number, slot: number, spec: Spec): number[] | null {
  const rnd = mulberry32(0x7a3c19d5 ^ (slot * 104729));
  for (let attempt = 0; attempt < 200000; attempt++) {
    const s = Array.from({ length: n }, (_, i) => i + 1);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [s[i], s[j]] = [s[j]!, s[i]!];
    }
    if (isSorted(s)) continue;
    if (parOf(s) !== par || waysOf(s) !== 1) continue;
    // 最少の手順（1 本）の最初の手
    const t = table(n);
    const d = t.dist.get(s.join(''))!;
    let first = 0;
    for (let k = 2; k <= n; k++) if (t.dist.get(flip(s, k).join('')) === d - 1) first = k;
    if (spec.notFlipAll && first === n) continue;
    // 「目先で良く見える手」: 隣り合う正しい組（大きさが 1 違う）が増える手が、最少の手順に入っていない
    return s;
  }
  return null;
}

const out = SPEC.map((w, wi) => ({
  name: w.name,
  trick: w.trick,
  levels: w.levels.map(([n, par], li) => {
    const f = find(n, par, wi * 10 + li + 1, w);
    if (!f) throw new Error(`見つからない: W${wi + 1}-${li + 1} n=${n} par=${par}`);
    console.log(`W${wi + 1}-${li + 1} n=${n} par ${par}`, f.join(','));
    return { id: `${wi + 1}-${li + 1}`, stack: f, par };
  }),
}));
writeFileSync(new URL('../src/levels.json', import.meta.url), JSON.stringify(out, null, 1));
console.log('書き出した');
