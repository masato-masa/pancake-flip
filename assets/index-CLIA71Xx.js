(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function s(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(n){if(n.ep)return;n.ep=!0;const a=s(n);fetch(n.href,a)}})();function fe(e){switch(e.screen){case"home":return"#/";case"select":return"#/select";case"play":return`#/play/${e.levelId}`}}function ve(e){const t=e.replace(/^#/,"");if(t==="/select")return{screen:"select"};const s=/^\/play\/([\w-]+)$/.exec(t);return s?{screen:"play",levelId:s[1]}:{screen:"home"}}class be{handler=()=>this.emit();listeners=[];get current(){return ve(window.location.hash)}onChange(t){this.listeners.push(t)}emit(){const t=this.current;for(const s of this.listeners)s(t)}start(){window.addEventListener("hashchange",this.handler),this.emit()}go(t){const s=fe(t);window.location.hash===s?this.emit():window.location.hash=s}stop(){window.removeEventListener("hashchange",this.handler)}}const me=[{name:"ひっくり返す",trick:"1 枚を選ぶと、そのパンケーキと上の全部がまとめてひっくり返る。いちばん大きいのを下へ運ぶ",levels:[{id:"1-1",stack:[3,1,2,4],par:2},{id:"1-2",stack:[1,3,4,2],par:3},{id:"1-3",stack:[4,5,3,1,2],par:3},{id:"1-4",stack:[4,2,3,5,1],par:4}]},{name:"もどして ひっくり返す",trick:"大きいのを下に運んだら、そこは触らない。残りの山で同じことを繰り返す",levels:[{id:"2-1",stack:[4,2,1,5,3],par:4},{id:"2-2",stack:[4,1,2,5,6,3],par:4},{id:"2-3",stack:[2,3,6,4,1,5],par:5},{id:"2-4",stack:[1,6,4,2,3,5],par:5}]},{name:"とおまわり",trick:"一度崩してから揃える。目先で良く見える手が、最少の手順ではない",levels:[{id:"3-1",stack:[4,6,1,3,5,2],par:6},{id:"3-2",stack:[6,1,5,7,2,4,3],par:6},{id:"3-3",stack:[4,2,7,5,3,6,1],par:7},{id:"3-4",stack:[4,7,5,1,3,6,2],par:7}]},{name:"ながい みち",trick:"8 枚。最少の手順は 1 本しかない（8 枚で最も長い 8 手）。先を読んで、順番をまちがえない",levels:[{id:"4-1",stack:[6,8,1,5,2,3,7,4],par:7},{id:"4-2",stack:[2,4,6,8,3,1,7,5],par:8},{id:"4-3",stack:[5,2,7,3,8,1,4,6],par:8},{id:"4-4",stack:[4,2,7,5,1,8,6,3],par:8}]}],ae=me.map((e,t)=>({id:`W${t+1}`,name:e.name,trick:e.trick,levels:e.levels})),f=ae.flatMap(e=>e.levels),ge=e=>f.find(t=>t.id===e),ye=e=>{const t=f.findIndex(s=>s.id===e);return t>=0&&t+1<f.length?f[t+1].id:null},U="pancake-flip:v1",B=new Map,k={get(e){try{return window.localStorage.getItem(e)}catch{return B.get(e)??null}},set(e,t){try{window.localStorage.setItem(e,t)}catch{B.set(e,t)}},del(e){try{window.localStorage.removeItem(e)}catch{B.delete(e)}}};class we{data={};constructor(){try{const t=k.get(U),s=t?JSON.parse(t):{};s&&typeof s=="object"&&(this.data=s)}catch{this.data={}}}save(){k.set(U,JSON.stringify(this.data))}stars(t){return this.data[t]?.stars??0}best(t){return this.data[t]?.taps??null}isCleared(t){return this.stars(t)>0}isUnlocked(t){const s=f.findIndex(o=>o.id===t);return s<0?!1:s===0||this.isCleared(f[s-1].id)}record(t,s,o){const n=this.data[t];this.data[t]={stars:n&&n.stars>s?n.stars:s,taps:n&&n.taps<o?n.taps:o},this.save()}total(){return f.reduce((t,s)=>t+this.stars(s.id),0)}worldStars(t){return t.reduce((s,o)=>s+this.stars(o),0)}firstUncleared(){return(f.find(t=>!this.isCleared(t.id))??f[f.length-1]).id}unlockAll(){for(const t of f)this.isCleared(t.id)||this.record(t.id,1,t.par+9)}clear(){this.data={},k.del(U)}}const C={sfx(){return k.get("pancake-flip:sfx")!=="0"},setSfx(e){k.set("pancake-flip:sfx",e?"1":"0")},seenTip(){return k.get("pancake-flip:tip")==="1"},setSeenTip(){k.set("pancake-flip:tip","1")}};function D(e,t){const s=e.slice();for(let o=0,n=t-1;o<n;o++,n--)[s[o],s[n]]=[s[n],s[o]];return s}const ke=e=>e.every((t,s)=>t===s+1),g=e=>e.join(""),ee=new Map;function Le(e){const t=ee.get(e);if(t)return t;const s=Array.from({length:e},(d,c)=>c+1),o=new Map([[g(s),0]]),n=new Map([[g(s),1]]);let a=[s];for(;a.length;){const d=[];for(const c of a){const u=o.get(g(c));for(let p=2;p<=e;p++){const h=D(c,p),v=g(h),$=o.get(v);$===void 0?(o.set(v,u+1),n.set(v,n.get(g(c))),d.push(h)):$===u+1&&n.set(v,n.get(v)+n.get(g(c)))}}a=d}const r={n:e,dist:o,ways:n};return ee.set(e,r),r}function $e(e){const t=Le(e.length),s=t.dist.get(g(e));if(s===0)return null;for(let o=2;o<=e.length;o++)if(t.dist.get(g(D(e,o)))===s-1)return o;return null}const xe=(e,t)=>e<=t?3:e<=t+1?2:1,F=e=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`,Te=()=>F('<path d="M9 14 L4 9 l5 -5" /><path d="M4 9 h11 a5 5 0 0 1 0 10 h-4" />'),Ae=()=>F('<path d="M21 12 a9 9 0 1 1 -3 -6.7" /><path d="M21 3 v6 h-6" />'),Se=()=>F('<path d="M9 18 h6" /><path d="M10 22 h4" /><path d="M12 2 a7 7 0 0 0 -4 12.7 V18 h8 v-3.3 A7 7 0 0 0 12 2 Z" />'),G=e=>`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.4" fill="var(--accent)" />${e}</svg>`,oe=()=>G('<path d="M13.6 7.8 L9.4 12 l4.2 4.2" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" />'),Ee=()=>G('<path d="M9.5 9.3 a2.6 2.6 0 1 1 3.2 2.9 v1.5" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" /><circle cx="12.6" cy="16.6" r="1.25" fill="#fff" />'),ie=()=>G('<path fill="#fff" d="M10.65 7.29 L10.86 5.19 A6.9 6.9 0 0 1 13.14 5.19 L13.35 7.29 A4.9 4.9 0 0 1 14.38 7.71 L16.01 6.38 A6.9 6.9 0 0 1 17.62 7.99 L16.29 9.62 A4.9 4.9 0 0 1 16.71 10.65 L18.81 10.86 A6.9 6.9 0 0 1 18.81 13.14 L16.71 13.35 A4.9 4.9 0 0 1 16.29 14.38 L17.62 16.01 A6.9 6.9 0 0 1 16.01 17.62 L14.38 16.29 A4.9 4.9 0 0 1 13.35 16.71 L13.14 18.81 A6.9 6.9 0 0 1 10.86 18.81 L10.65 16.71 A4.9 4.9 0 0 1 9.62 16.29 L7.99 17.62 A6.9 6.9 0 0 1 6.38 16.01 L7.71 14.38 A4.9 4.9 0 0 1 7.29 13.35 L5.19 13.14 A6.9 6.9 0 0 1 5.19 10.86 L7.29 10.65 A4.9 4.9 0 0 1 7.71 9.62 L6.38 7.99 A6.9 6.9 0 0 1 7.99 6.38 L9.62 7.71 A4.9 4.9 0 0 1 10.65 7.29 Z" /><circle cx="12" cy="12" r="2.1" fill="var(--accent)" />');let m=null,q=null;const le=typeof location<"u"&&new URLSearchParams(location.search).has("mute");let K=!le&&C.sfx();const te=()=>K;function Me(e){K=e&&!le,C.setSfx(e)}function Ce(){if(!K)return null;try{if(!m){m=new AudioContext;const e=m.createDynamicsCompressor();e.threshold.value=-16,e.knee.value=20,e.ratio.value=6,e.attack.value=.003,e.release.value=.15,q=m.createGain(),q.gain.value=.85,q.connect(e).connect(m.destination)}return m.state==="suspended"&&m.resume(),m}catch{return null}}const se={},N=(e,t)=>{const s=performance.now();return s-(se[e]??-1e9)<t?!1:(se[e]=s,!0)};function w(e,t,s,o,n=0,a,r=0){const d=Ce();if(!d||!q)return;const c=d.currentTime+n,u=d.createOscillator(),p=d.createGain();if(u.type=s,u.frequency.setValueAtTime(e,c),a&&u.frequency.exponentialRampToValueAtTime(Math.max(30,a),c+t),p.gain.setValueAtTime(1e-4,c),p.gain.exponentialRampToValueAtTime(o,c+.008),p.gain.exponentialRampToValueAtTime(1e-4,c+t),r){const h=d.createBiquadFilter();h.type="lowpass",h.frequency.value=r,u.connect(h).connect(p)}else u.connect(p);p.connect(q),u.start(c),u.stop(c+t+.03)}const ne=e=>{try{navigator.vibrate?.(e)}catch{}},M={flip(e){if(!N("flip",45))return;const t=520-e*38;w(t,.12,"triangle",.15,0,t*.55,1800),w(t*2.2,.05,"sine",.05,.01),ne(6+e)},settle(){N("settle",60)&&w(880,.12,"sine",.08,.06,0,3e3)},undo(){N("undo",60)&&w(420,.08,"sine",.07,0,300)},clear(){[523.25,659.25,783.99,1046.5].forEach((e,t)=>{w(e,.34,"triangle",.15,t*.1,0,3400),w(e*2,.2,"sine",.03,t*.1+.02)}),w(1318.5,.6,"sine",.05,.42),ne(60)}};function z(e,t){const s=document.createElement("div");s.className="overlay",s.innerHTML=`<div class="sheet">${e}</div>`,document.body.appendChild(s);const o=()=>{s.remove(),document.removeEventListener("keydown",n)},n=a=>{a.key==="Escape"&&o()};document.addEventListener("keydown",n),s.addEventListener("click",a=>{const r=a.target;(r===s||r.closest(".sheet-close"))&&o()}),t?.(s,o)}function qe(){z(`<h2 class="sheet-title">遊びかた</h2>
     <ul class="help-list">
       <li>パンケーキが 縦に つまれている。1 まいを タップすると、そのパンケーキと 上の ぜんぶが、まとめて ひっくり返る。</li>
       <li>いちばん上が 一番ちいさく、下に いくほど 大きい ならびに すれば クリア。</li>
       <li>大きいのを 下へ はこぶ。はこんだら、そこは さわらずに のこりで くりかえす。</li>
       <li>手数が すくないほど ★ が ふえる。さいたんは かならず 1 通りだけ。</li>
     </ul>
     <button class="sheet-btn sheet-close" type="button">とじる</button>`)}function ce(){z(`<h2 class="sheet-title">設定</h2>
     <div class="sheet-row static">
       <span>効果音</span>
       <button class="switch mute-toggle" type="button" role="switch" aria-checked="${te()}" aria-label="効果音の入切"></button>
     </div>
     <button class="sheet-btn sheet-close" type="button">とじる</button>`,e=>{const t=e.querySelector(".mute-toggle");t.addEventListener("click",()=>{const s=!te();Me(s),t.setAttribute("aria-checked",String(s)),s&&M.flip(4)})})}function Oe(e,t){z(`<h2 class="sheet-title">テストツール</h2>
     <p class="dev-note">本番では使わない、動作確認用のボタンです。</p>
     <button class="sheet-row unlock-all" type="button">全ステージ開放</button>
     <button class="sheet-row danger clear-all" type="button">きろくを ぜんぶ けす</button>
     <p class="dev-status"></p>
     <button class="sheet-link sheet-close" type="button">とじる</button>`,s=>{const o=s.querySelector(".dev-status");s.querySelector(".unlock-all").addEventListener("click",()=>{e.unlockAll(),o.textContent="全ステージを開放しました。",t()}),s.querySelector(".clear-all").addEventListener("click",()=>{window.confirm("きろくを ぜんぶ けしますか？")&&(e.clear(),o.textContent="きろくを消しました。",t())})})}function Ie(e,t,s){const o=ge(t);if(!o)return s.go({screen:"home"}),()=>{};const n=o,a=n.stack.length,r=ye(n.id);let d=n.stack.slice();const c=[];let u=0,p=0,h=0,v=0,$=!1,x=!1,J="";for(let i=0;i<a;i++)J+=`<div class="pc" data-i="${i}"><b></b></div>`;e.innerHTML=`
    <div class="app app-game game-screen">
      <header class="header">
        <div class="header-row">
          <div class="header-left"><button class="icon-btn back-btn" type="button" aria-label="もどる">${oe()}</button></div>
          <h1 class="title">${n.id}</h1>
          <div class="header-actions">
            <button class="icon-btn help-btn" type="button" aria-label="遊びかた">${Ee()}</button>
            <button class="icon-btn settings-btn" type="button" aria-label="設定">${ie()}</button>
          </div>
        </div>
        <div class="status-bar">
          <span class="stat"><span class="stat-label">てすう</span><span class="stat-num moves">0</span><span class="stat-label">さいたん ${n.par}</span></span>
        </div>
      </header>
      <div class="board-wrap">
        <div class="board" style="--n:${a}">
          ${J}
          <div class="toast" hidden></div>
        </div>
      </div>
      <footer class="footer">
        <button class="tool undo-btn" type="button" aria-label="もどす" disabled>${Te()}</button>
        <button class="tool retry-btn" type="button" aria-label="やりなおし">${Ae()}</button>
        <button class="tool hint-btn" type="button" aria-label="ヒント">${Se()}</button>
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
    </div>`;const b=i=>e.querySelector(i),L=b(".board"),T=b(".toast"),re=b(".moves"),de=b(".undo-btn"),A=b(".game-message"),O=Array.from(L.querySelectorAll(".pc"));r||b(".next-btn").setAttribute("hidden","");function I(i=0){for(let l=0;l<a;l++){const y=O[l],H=d[l];y.style.setProperty("--w",`${28+72*(H-1)/Math.max(1,a-1)}%`),y.querySelector("b").textContent=String(H);let j=!0;for(let R=a-1;R>=l;R--)d[R]!==R+1&&(j=!1);y.classList.toggle("done",j),y.classList.remove("flipping")}if(i>0){L.offsetWidth;for(let l=0;l<i;l++)O[l].classList.add("flipping")}re.textContent=String(u),de.disabled=c.length===0}I();const P=i=>{T.textContent=i,T.hidden=!1,window.clearTimeout(h),h=window.setTimeout(()=>T.hidden=!0,1800)};C.seenTip()||(P("パンケーキを タップ = そこから上を ひっくり返す"),window.clearTimeout(h),h=window.setTimeout(()=>T.hidden=!0,5e3));function ue(){if($)return;const i=xe(u,n.par);s.store.record(n.id,i,u),M.clear(),b(".stars").innerHTML=[0,1,2].map(l=>`<span class="star${l<i?" on":""}" style="--i:${l}">★</span>`).join(""),b(".message-moves").textContent=u<=n.par?`${u} 手 — さいたん!`:`${u} 手 ・ あと ${u-n.par} へらすと ★3`,A.hidden=!1}function S(){O.forEach(i=>i.classList.remove("hint")),window.clearTimeout(v)}const pe=i=>{if(!A.hidden||x)return;const l=i+1;if(l<2){M.undo(),P("いちばん上は ひっくり返しても かわらない");return}C.seenTip()||(C.setSeenTip(),T.hidden=!0),c.push(d),d=D(d,l),u++,S(),M.flip(l),I(l),ke(d)&&(x=!0,p=window.setTimeout(ue,520))},Y=()=>{window.clearTimeout(p),d=n.stack.slice(),c.length=0,u=0,x=!1,A.hidden=!0,S(),I()},Z=()=>{!c.length||!A.hidden||x||(d=c.pop(),u--,M.undo(),S(),I())},he=()=>{if(x||!A.hidden)return;S();const i=$e(d);i!==null&&(O[i-1].classList.add("hint"),P(`ここを タップ（上から ${i} まいを ひっくり返す）`),v=window.setTimeout(S,3500))},_=i=>{if(!L.contains(i.target))return;i.preventDefault();const l=L.getBoundingClientRect(),y=6,H=(l.height-y*2)/a,j=Math.min(a-1,Math.max(0,Math.floor((i.clientY-l.top-y)/H)));pe(j)};L.addEventListener("pointerdown",_);const Q=i=>{const l=i.target;l.closest(".back-btn")?s.go({screen:"select"}):l.closest(".help-btn")?qe():l.closest(".settings-btn")?ce():l.closest(".undo-btn")?Z():l.closest(".retry-btn")?Y():l.closest(".hint-btn")?he():l.closest(".next-btn")&&r?s.go({screen:"play",levelId:r}):l.closest(".again-btn")?Y():l.closest(".select-btn")&&s.go({screen:"select"})};e.addEventListener("click",Q);const X=i=>{(i.key==="z"||i.key==="Backspace")&&Z()};return window.addEventListener("keydown",X),()=>{$=!0,window.clearTimeout(p),window.clearTimeout(h),window.clearTimeout(v),L.removeEventListener("pointerdown",_),e.removeEventListener("click",Q),window.removeEventListener("keydown",X)}}const He=()=>`
<div class="home-hero" aria-hidden="true">
  <span class="hp" style="--w:34%"></span>
  <span class="hp" style="--w:58%"></span>
  <span class="hp" style="--w:46%"></span>
  <span class="hp" style="--w:82%"></span>
  <span class="hp" style="--w:68%"></span>
</div>`;function je(e,t){const{store:s}=t,o=()=>{const a=s.total();e.innerHTML=`
      <div class="app app-home home-screen">
        <div class="home-top">
          <button class="icon-btn settings-btn" type="button" aria-label="設定">${ie()}</button>
        </div>
        <div class="home">
          <div class="home-art">${He()}</div>
          <h1 class="home-title">ひっくりパンケーキ</h1>
          <p class="home-sub">ひっくり返して、大きさじゅんに ならべよう</p>
          <div class="home-buttons">
            <button class="home-btn primary resume-btn" type="button">${a>0?"つづきから":"はじめる"}</button>
            <button class="home-btn select-btn" type="button">ステージを えらぶ</button>
          </div>
          <p class="home-progress">★ ${a} / ${f.length*3}</p>
        </div>
        <button class="dev-pill" type="button">テスト用</button>
      </div>`};o();const n=a=>{const r=a.target;r.closest(".resume-btn")?t.go({screen:"play",levelId:s.firstUncleared()}):r.closest(".select-btn")?t.go({screen:"select"}):r.closest(".settings-btn")?ce():r.closest(".dev-pill")&&Oe(s,o)};return e.addEventListener("click",n),()=>e.removeEventListener("click",n)}function Re(e,t){const{store:s}=t,o=ae.map(a=>{const r=a.levels.some(c=>s.isUnlocked(c.id)),d=a.levels.map(c=>{const u=s.isUnlocked(c.id),p=s.stars(c.id),h=c.id.split("-")[1];return`<button class="level-card${u?"":" locked"}${p===3?" perfect":""}" type="button" data-level="${c.id}"${u?"":' aria-disabled="true"'}>
            <span class="level-num">${h}</span>
            <span class="level-stars">${u?[0,1,2].map(v=>`<span class="star${v<p?" on":""}">★</span>`).join(""):'<span class="lock">🔒</span>'}</span>
          </button>`}).join("");return`<section class="world">
      <h2 class="world-head"><span class="world-name">${a.id} ${a.name}</span>${r?`<span class="world-stars">★ ${s.worldStars(a.levels.map(c=>c.id))} / ${a.levels.length*3}</span>`:""}</h2>
      <div class="level-grid">${d}</div>
    </section>`}).join("");e.innerHTML=`
    <div class="app select-screen">
      <header class="header">
        <div class="header-row">
          <div class="header-left"><button class="icon-btn back-btn" type="button" aria-label="もどる">${oe()}</button></div>
          <h1 class="title">ステージ</h1>
          <div class="header-actions"></div>
        </div>
        <div class="status-bar"><span class="stat"><span class="stat-label">★</span><span class="stat-num">${s.total()}</span><span class="stat-label">/ ${f.length*3}</span></span></div>
      </header>
      <div class="worlds">${o}</div>
    </div>`;const n=a=>{const r=a.target;r.closest(".back-btn")&&t.go({screen:"home"});const d=r.closest(".level-card");d&&!d.classList.contains("locked")&&t.go({screen:"play",levelId:d.dataset.level})};return e.addEventListener("click",n),()=>e.removeEventListener("click",n)}const V=document.querySelector("#app"),Pe=new we,W=new be;let E=null;const Ue=e=>W.go(e);W.onChange(e=>{E?.(),E=null,window.scrollTo(0,0);const t={store:Pe,go:Ue};e.screen==="home"?E=je(V,t):e.screen==="select"?E=Re(V,t):E=Ie(V,e.levelId,t)});W.start();
