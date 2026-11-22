import { ALL_LEVELS } from '../levels.ts';

const KEY = 'pancake-flip:v1';
type Rec = { stars: 1 | 2 | 3; taps: number };

/** 保存できない環境（プライベートモードなど）でも落ちないように、メモリへ逃がす。 */
const mem = new Map<string, string>();
const kv = {
  get(k: string): string | null {
    try {
      return window.localStorage.getItem(k);
    } catch {
      return mem.get(k) ?? null;
    }
  },
  set(k: string, v: string): void {
    try {
      window.localStorage.setItem(k, v);
    } catch {
      mem.set(k, v);
    }
  },
  del(k: string): void {
    try {
      window.localStorage.removeItem(k);
    } catch {
      mem.delete(k);
    }
  },
};

export class Progress {
  private data: Record<string, Rec> = {};
  constructor() {
    try {
      const raw = kv.get(KEY);
      const p = raw ? (JSON.parse(raw) as Record<string, Rec>) : {};
      if (p && typeof p === 'object') this.data = p;
    } catch {
      this.data = {};
    }
  }
  private save(): void {
    kv.set(KEY, JSON.stringify(this.data));
  }
  stars(id: string): 0 | 1 | 2 | 3 {
    return this.data[id]?.stars ?? 0;
  }
  best(id: string): number | null {
    return this.data[id]?.taps ?? null;
  }
  isCleared(id: string): boolean {
    return this.stars(id) > 0;
  }
  isUnlocked(id: string): boolean {
    const i = ALL_LEVELS.findIndex((l) => l.id === id);
    if (i < 0) return false;
    return i === 0 || this.isCleared(ALL_LEVELS[i - 1]!.id);
  }
  record(id: string, stars: 1 | 2 | 3, moves: number): void {
    // taps には最少の手数を入れる（小さいほど良い）
    const p = this.data[id];
    this.data[id] = { stars: p && p.stars > stars ? p.stars : stars, taps: p && p.taps < moves ? p.taps : moves };
    this.save();
  }
  total(): number {
    return ALL_LEVELS.reduce((n, l) => n + this.stars(l.id), 0);
  }
  worldStars(ids: string[]): number {
    return ids.reduce((n, id) => n + this.stars(id), 0);
  }
  firstUncleared(): string {
    return (ALL_LEVELS.find((l) => !this.isCleared(l.id)) ?? ALL_LEVELS[ALL_LEVELS.length - 1]!).id;
  }
  unlockAll(): void {
    for (const l of ALL_LEVELS) if (!this.isCleared(l.id)) this.record(l.id, 1, l.par + 9);
  }
  clear(): void {
    this.data = {};
    kv.del(KEY);
  }
}

export const settings = {
  sfx(): boolean {
    return kv.get('pancake-flip:sfx') !== '0';
  },
  setSfx(v: boolean): void {
    kv.set('pancake-flip:sfx', v ? '1' : '0');
  },
  /** 初見のヒント（1 回だけ出す） */
  seenTip(): boolean {
    return kv.get('pancake-flip:tip') === '1';
  },
  setSeenTip(): void {
    kv.set('pancake-flip:tip', '1');
  },
};
