// ひっくりパンケーキ: n 枚のパンケーキ（大きさ 1〜n、1 が最小）が縦に積まれている。
// 1 枚を選ぶと、そのパンケーキとそれより上の全部が、まとめてひっくり返る（上 k 枚の並びが逆になる）。
// 上から小さい順（いちばん上が 1、いちばん下が n）に並べればクリア。最少の手数（par）はソルバーで証明する。
// 画面にもソルバーにも依存しない純粋な計算。

/** 上から順の大きさ。stack[0] が最上段。 */
export type Stack = number[];

/** 上から k 枚（k = 2〜n）をひっくり返す。k = 1 は何も変わらないので手として数えない。 */
export function flip(s: Stack, k: number): Stack {
  const out = s.slice();
  for (let i = 0, j = k - 1; i < j; i++, j--) [out[i], out[j]] = [out[j]!, out[i]!];
  return out;
}

export const isSorted = (s: Stack): boolean => s.every((v, i) => v === i + 1);

/** 並びを文字列にする（状態の見出し）。n ≤ 9 を想定。 */
export const keyOf = (s: Stack): string => s.join('');

/** n 枚の全並びについて、「ソート済みからの最少手数」と「最少の手順の本数」を、幅優先で求める。 */
export interface Table {
  n: number;
  dist: Map<string, number>;
  /** その並びからソート済みまでの最少の手順の本数 */
  ways: Map<string, number>;
}

const tables = new Map<number, Table>();

export function table(n: number): Table {
  const hit = tables.get(n);
  if (hit) return hit;
  const sorted: Stack = Array.from({ length: n }, (_, i) => i + 1);
  const dist = new Map<string, number>([[keyOf(sorted), 0]]);
  const ways = new Map<string, number>([[keyOf(sorted), 1]]);
  let frontier: Stack[] = [sorted];
  while (frontier.length) {
    const next: Stack[] = [];
    for (const s of frontier) {
      const d = dist.get(keyOf(s))!;
      for (let k = 2; k <= n; k++) {
        const t = flip(s, k);
        const key = keyOf(t);
        const dt = dist.get(key);
        if (dt === undefined) {
          dist.set(key, d + 1);
          ways.set(key, ways.get(keyOf(s))!);
          next.push(t);
        } else if (dt === d + 1) {
          ways.set(key, ways.get(key)! + ways.get(keyOf(s))!);
        }
      }
    }
    frontier = next;
  }
  const t: Table = { n, dist, ways };
  tables.set(n, t);
  return t;
}

/** その並びを解くのに要る最少の手数（par）。 */
export const parOf = (s: Stack): number => table(s.length).dist.get(keyOf(s))!;
/** 最少の手順の本数（1 なら、解き方が一通りだけ） */
export const waysOf = (s: Stack): number => table(s.length).ways.get(keyOf(s))!;

/** いまの並びから、最少の手数に近づく手（k）。最少の手が複数あるときは小さい k。ソート済みなら null。 */
export function hintMove(s: Stack): number | null {
  const t = table(s.length);
  const d = t.dist.get(keyOf(s))!;
  if (d === 0) return null;
  for (let k = 2; k <= s.length; k++) if (t.dist.get(keyOf(flip(s, k))) === d - 1) return k;
  return null;
}

/** ★: par 以内 3、+1 で 2、それ以上 1 */
export const starsFor = (moves: number, par: number): 1 | 2 | 3 => (moves <= par ? 3 : moves <= par + 1 ? 2 : 1);
