// 全面の再検証: 最少手数が par と一致・最少の手順がちょうど 1 本・最初から揃っていない・最初の最善手が「全部ひっくり返す」でない。
//   npm test
import { flip, isSorted, parOf, waysOf, table } from '../src/engine.ts';
import data from '../src/levels.json' with { type: 'json' };

const ALL = data.flatMap((w) => w.levels);
let ng = 0;
const t0 = Date.now();
for (const l of ALL) {
  const problems: string[] = [];
  const n = l.stack.length;
  if (isSorted(l.stack)) problems.push('最初から揃っている');
  if (parOf(l.stack) !== l.par) problems.push(`par 不一致（解いた結果 ${parOf(l.stack)}、面の値 ${l.par}）`);
  if (waysOf(l.stack) !== 1) problems.push(`最少の手順が ${waysOf(l.stack)} 本`);
  if (new Set(l.stack).size !== n || Math.min(...l.stack) !== 1 || Math.max(...l.stack) !== n) problems.push('並びが 1〜n の順列でない');
  const t = table(n);
  const d = t.dist.get(l.stack.join(''))!;
  if (t.dist.get(flip(l.stack, n).join('')) === d - 1) problems.push('最初の最善手が全部ひっくり返す');
  if (problems.length) {
    ng++;
    console.log(`NG ${l.id}: ${problems.join(' / ')}`);
  }
}
console.log(`${ALL.length} 面、NG ${ng}（${Date.now() - t0}ms）`);
process.exit(ng ? 1 : 0);
