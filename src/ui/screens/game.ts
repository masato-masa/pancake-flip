import { type Stack, flip, hintMove, isSorted, starsFor } from '../../engine.ts';
import { getLevel, nextLevelId } from '../../levels.ts';
import { iconBack, iconGear, iconHelp, iconHint, iconReset, iconUndo } from '../icons.ts';
import { openHelpSheet, openSettingsSheet } from '../sheets.ts';
import { sfx } from '../sfx.ts';
import { settings } from '../storage.ts';
import type { Deps } from '../types.ts';

export function renderGame(root: HTMLElement, levelId: string, deps: Deps): () => void {
  const def = getLevel(levelId);
  if (!def) {
    deps.go({ screen: 'home' });
    return () => {};
  }
  const level = def;
  const n = level.stack.length;
  const next = nextLevelId(level.id);
  let stack: Stack = level.stack.slice();
  const history: Stack[] = [];
  let moves = 0;
  let winTimer = 0;
  let toastTimer = 0;
  let hintTimer = 0;
  let disposed = false;
  let cleared = false;

  let rows = '';
  for (let i = 0; i < n; i++) rows += `<div class="pc" data-i="${i}"><b></b></div>`;

  root.innerHTML = `
    <div class="app app-game game-screen">
      <header class="header">
        <div class="header-row">
          <div class="header-left"><button class="icon-btn back-btn" type="button" aria-label="もどる">${iconBack()}</button></div>
          <h1 class="title">${level.id}</h1>
          <div class="header-actions">
            <button class="icon-btn help-btn" type="button" aria-label="遊びかた">${iconHelp()}</button>
            <button class="icon-btn settings-btn" type="button" aria-label="設定">${iconGear()}</button>
          </div>
        </div>
        <div class="status-bar">
          <span class="stat"><span class="stat-label">てすう</span><span class="stat-num moves">0</span><span class="stat-label">さいたん ${level.par}</span></span>
        </div>
      </header>
      <div class="board-wrap">
        <div class="board" style="--n:${n}">
          ${rows}
          <div class="toast" hidden></div>
        </div>
      </div>
      <footer class="footer">
        <button class="tool undo-btn" type="button" aria-label="もどす" disabled>${iconUndo()}</button>
        <button class="tool retry-btn" type="button" aria-label="やりなおし">${iconReset()}</button>
        <button class="tool hint-btn" type="button" aria-label="ヒント">${iconHint()}</button>
      </footer>
      <div class="overlay game-message" hidden>
        <div class="sheet message-card">
          <p class="message-title">クリア!</p>
          <div class="stars"></div>
          <p class="message-moves"></p>
          <div class="message-buttons">
            <button class="sheet-btn next-btn" type="button">つぎへ</button>
            <button class="sheet-btn quiet again-btn" type="button">もういちど</button>
            <button class="sheet-btn quiet select-btn" type="button">ステージせんたく</button>
          </div>
        </div>
      </div>
    </div>`;

  const q = <T extends HTMLElement>(sel: string): T => root.querySelector<T>(sel)!;
  const boardEl = q('.board');
  const toastEl = q('.toast');
  const movesEl = q('.moves');
  const undoBtn = q<HTMLButtonElement>('.undo-btn');
  const msg = q('.game-message');
  const pcs = Array.from(boardEl.querySelectorAll<HTMLElement>('.pc'));
  if (!next) q('.next-btn').setAttribute('hidden', '');

  function render(animateTop = 0): void {
    for (let i = 0; i < n; i++) {
      const el = pcs[i]!;
      const v = stack[i]!;
      el.style.setProperty('--w', `${28 + (72 * (v - 1)) / Math.max(1, n - 1)}%`);
      el.querySelector('b')!.textContent = String(v);
      // 下から、すでに正しい位置に決まっているもの（もう触らなくてよい）
      let done = true;
      for (let j = n - 1; j >= i; j--) if (stack[j] !== j + 1) done = false;
      el.classList.toggle('done', done);
      el.classList.toggle('flipping', i < animateTop);
      if (i < animateTop) {
        el.classList.remove('flipping');
        void el.offsetWidth;
        el.classList.add('flipping');
      }
    }
    movesEl.textContent = String(moves);
    undoBtn.disabled = history.length === 0;
  }
  render();

  const toast = (t: string): void => {
    toastEl.textContent = t;
    toastEl.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => (toastEl.hidden = true), 1800);
  };
  if (!settings.seenTip()) {
    toast('パンケーキを タップ = そこから上を ひっくり返す');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => (toastEl.hidden = true), 5000);
  }

  function showClear(): void {
    if (disposed) return;
    const stars = starsFor(moves, level.par);
    deps.store.record(level.id, stars, moves);
    sfx.clear();
    q('.stars').innerHTML = [0, 1, 2].map((i) => `<span class="star${i < stars ? ' on' : ''}" style="--i:${i}">★</span>`).join('');
    q('.message-moves').textContent = moves <= level.par ? `${moves} 手 — さいたん!` : `${moves} 手 ・ あと ${moves - level.par} へらすと ★3`;
    msg.hidden = false;
  }

  function clearHint(): void {
    pcs.forEach((e) => e.classList.remove('hint'));
    window.clearTimeout(hintTimer);
  }

  const doFlip = (i: number): void => {
    if (!msg.hidden || cleared) return;
    const k = i + 1;
    if (k < 2) {
      sfx.undo();
      toast('いちばん上は ひっくり返しても かわらない');
      return;
    }
    if (!settings.seenTip()) {
      settings.setSeenTip();
      toastEl.hidden = true;
    }
    history.push(stack);
    stack = flip(stack, k);
    moves++;
    clearHint();
    sfx.flip(k);
    render(k);
    if (isSorted(stack)) {
      cleared = true;
      winTimer = window.setTimeout(showClear, 520);
    }
  };

  const reset = (): void => {
    window.clearTimeout(winTimer);
    stack = level.stack.slice();
    history.length = 0;
    moves = 0;
    cleared = false;
    msg.hidden = true;
    clearHint();
    render();
  };

  const undo = (): void => {
    if (!history.length || !msg.hidden || cleared) return;
    stack = history.pop()!;
    moves--;
    sfx.undo();
    clearHint();
    render();
  };

  const hint = (): void => {
    if (cleared || !msg.hidden) return;
    clearHint();
    const k = hintMove(stack);
    if (k === null) return;
    pcs[k - 1]!.classList.add('hint');
    toast(`ここを タップ（上から ${k} まいを ひっくり返す）`);
    hintTimer = window.setTimeout(clearHint, 3500);
  };

  const onPointerDown = (ev: PointerEvent): void => {
    const el = (ev.target as HTMLElement).closest<HTMLElement>('.pc');
    if (!el || !boardEl.contains(el)) return;
    ev.preventDefault();
    doFlip(Number(el.dataset.i));
  };
  boardEl.addEventListener('pointerdown', onPointerDown);

  const onClick = (ev: Event): void => {
    const t = ev.target as HTMLElement;
    if (t.closest('.back-btn')) deps.go({ screen: 'select' });
    else if (t.closest('.help-btn')) openHelpSheet();
    else if (t.closest('.settings-btn')) openSettingsSheet();
    else if (t.closest('.undo-btn')) undo();
    else if (t.closest('.retry-btn')) reset();
    else if (t.closest('.hint-btn')) hint();
    else if (t.closest('.next-btn') && next) deps.go({ screen: 'play', levelId: next });
    else if (t.closest('.again-btn')) reset();
    else if (t.closest('.select-btn')) deps.go({ screen: 'select' });
  };
  root.addEventListener('click', onClick);
  const onKey = (ev: KeyboardEvent): void => {
    if (ev.key === 'z' || ev.key === 'Backspace') undo();
  };
  window.addEventListener('keydown', onKey);

  return () => {
    disposed = true;
    window.clearTimeout(winTimer);
    window.clearTimeout(toastTimer);
    window.clearTimeout(hintTimer);
    boardEl.removeEventListener('pointerdown', onPointerDown);
    root.removeEventListener('click', onClick);
    window.removeEventListener('keydown', onKey);
  };
}
