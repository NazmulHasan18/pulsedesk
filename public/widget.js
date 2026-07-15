(()=>{var C=`
:host {
  all: initial;
  --paper: #F6F5F1;
  --surface: #FFFEFB;
  --ink: #14171C;
  --muted: #656A74;
  --line: #E6E3DA;
  --line-strong: #CFCCC0;
  --indigo: #4B4FE0;
  --indigo-dark: #3638B8;
  --indigo-tint: #ECEAFD;
  --signal: #1F9D68;
  --signal-tint: #E2F5EA;
  --signal-ink: #157A50;
  --amber: #D98A1F;
  --amber-tint: #FBEDD8;
  --amber-ink: #9C6413;
  --font-sans: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  --font-display: "Space Grotesk", var(--font-sans);
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  position: fixed;
  z-index: 2147483000;
  bottom: 20px;
  right: 20px;
  font-family: var(--font-sans);
}

* { box-sizing: border-box; }

.launcher {
  width: 56px;
  height: 56px;
  border-radius: 999px;
  background: var(--indigo);
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(75, 79, 224, 0.35), 0 2px 6px rgba(20, 23, 28, 0.12);
  transition: transform 160ms ease, box-shadow 160ms ease;
}
.launcher:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(75, 79, 224, 0.4); }
.launcher:focus-visible { outline: 2px solid var(--indigo-dark); outline-offset: 3px; }
.launcher svg { width: 24px; height: 24px; }

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--amber);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--paper);
}

.panel {
  position: absolute;
  bottom: 72px;
  right: 0;
  width: 360px;
  max-width: calc(100vw - 40px);
  height: 520px;
  max-height: calc(100vh - 120px);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: 0 20px 48px rgba(20, 23, 28, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  transform: translateY(12px) scale(0.98);
  pointer-events: none;
  transition: opacity 160ms ease, transform 160ms ease;
}
.panel.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }

@media (prefers-reduced-motion: reduce) {
  .launcher, .panel { transition: none; }
}

.header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--surface);
}
.header-info { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.company-name {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px 2px 6px;
  border-radius: 999px;
  width: fit-content;
}
.pill-dot { width: 6px; height: 6px; border-radius: 999px; }
.pill.agent { background: var(--signal-tint); color: var(--signal-ink); }
.pill.agent .pill-dot { background: var(--signal); }
.pill.ai { background: var(--amber-tint); color: var(--amber-ink); }
.pill.ai .pill-dot { background: var(--amber); }
.pill.connecting { background: var(--line); color: var(--muted); }
.pill.connecting .pill-dot { background: var(--muted); }

.close-btn {
  border: none;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  display: flex;
}
.close-btn:hover { background: var(--paper); color: var(--ink); }
.close-btn:focus-visible { outline: 2px solid var(--indigo); outline-offset: 2px; }

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--paper);
}

.row { display: flex; flex-direction: column; max-width: 82%; }
.row.visitor { align-self: flex-end; align-items: flex-end; }
.row.other { align-self: flex-start; align-items: flex-start; }

.sender-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 3px;
  padding: 0 2px;
}

.bubble {
  padding: 9px 12px;
  border-radius: 14px;
  font-size: 13.5px;
  line-height: 1.45;
  word-wrap: break-word;
}
.row.visitor .bubble {
  background: var(--indigo);
  color: #fff;
  border-bottom-right-radius: 4px;
}
.row.other .bubble {
  background: var(--surface);
  color: var(--ink);
  border: 1px solid var(--line);
  border-bottom-left-radius: 4px;
}

.typing-bubble {
  display: inline-flex;
  gap: 3px;
  padding: 10px 12px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  border-bottom-left-radius: 4px;
  width: fit-content;
}
.typing-dot {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: var(--muted);
  animation: bounce 1.1s infinite ease-in-out;
}
.typing-dot:nth-child(2) { animation-delay: 0.12s; }
.typing-dot:nth-child(3) { animation-delay: 0.24s; }
@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-3px); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .typing-dot { animation: none; opacity: 0.8; }
}

.composer {
  border-top: 1px solid var(--line);
  background: var(--surface);
  padding: 10px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.composer textarea {
  flex: 1;
  resize: none;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 9px 11px;
  font-family: var(--font-sans);
  font-size: 13.5px;
  color: var(--ink);
  background: var(--paper);
  max-height: 88px;
  min-height: 38px;
  line-height: 1.4;
}
.composer textarea:focus-visible {
  outline: 2px solid var(--indigo);
  outline-offset: 1px;
  border-color: var(--indigo);
}
.composer textarea::placeholder { color: var(--muted); }

.send-btn {
  border: none;
  background: var(--indigo);
  color: #fff;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 120ms ease;
}
.send-btn:hover:not(:disabled) { background: var(--indigo-dark); }
.send-btn:disabled { background: var(--line-strong); cursor: not-allowed; }
.send-btn:focus-visible { outline: 2px solid var(--indigo-dark); outline-offset: 2px; }
.send-btn svg { width: 16px; height: 16px; }

.footer-note {
  font-family: var(--font-mono);
  font-size: 9.5px;
  color: var(--muted);
  text-align: center;
  padding: 4px 0 8px;
  background: var(--surface);
}

.messages::-webkit-scrollbar { width: 6px; }
.messages::-webkit-scrollbar-thumb { background: var(--line-strong); border-radius: 999px; }

@media (max-width: 480px) {
  :host { bottom: 12px; right: 12px; }
  .panel {
    width: calc(100vw - 24px);
    height: calc(100vh - 100px);
    bottom: 68px;
  }
}
`;function S(e){let r=[],n=[],t=[],d=[],a=o=>{r.forEach(s=>s(o))},c=o=>{n.forEach(s=>s(o))},u=o=>{t.forEach(s=>s(o))},m=(o,s)=>{let f=setTimeout(o,s);return d.push(f),f};return{connect:()=>{a("connecting"),m(()=>{let o=Math.random()>.5;a(o?"agent-online":"ai-only"),c({id:crypto.randomUUID(),role:"ai",text:e.welcomeMessage,createdAt:Date.now()})},500)},disconnect:()=>{d.forEach(clearTimeout),d=[]},sendMessage:o=>{c({id:crypto.randomUUID(),role:"visitor",text:o,createdAt:Date.now()}),u(!0);let s=900+Math.min(o.length*20,1800);m(()=>{u(!1),c({id:crypto.randomUUID(),role:"ai",text:T(o,e.companyName),createdAt:Date.now()})},s)},setVisitorTyping:o=>{},onPresence:o=>r.push(o),onMessage:o=>n.push(o),onRemoteTyping:o=>t.push(o)}}function T(e,r){let n=e.toLowerCase();return n.includes("price")||n.includes("cost")?`${r} has a free tier plus usage-based pricing for higher volume \u2014 want me to pull up the details?`:n.includes("human")||n.includes("agent")||n.includes("person")?"I can loop in a teammate for you \u2014 they'll join this chat as soon as one's free.":"Thanks for the message! I've noted this \u2014 a teammate or I will follow up with more detail shortly."}var L="wss://realtime.pulsedesk.io";function A(){var t;let e=document.currentScript,r=e==null?void 0:e.getAttribute("data-site-id");if(r)return r;let n=document.querySelector("script[data-site-id]");return(t=n==null?void 0:n.getAttribute("data-site-id"))!=null?t:null}function H(){var t;let e=document.currentScript,r=e==null?void 0:e.getAttribute("data-site-user-id");if(r)return r;let n=document.querySelector("script[data-site-user-id]");return(t=n==null?void 0:n.getAttribute("data-site-user-id"))!=null?t:null}function D(e,r){return{siteId:e,userId:r,companyId:`company_${e}`,companyName:"PulseDesk Demo Co.",brandColor:"#4B4FE0",welcomeMessage:"Hi! \u{1F44B} Ask me anything \u2014 I'll get you to a human if needed.",socketUrl:`${L}/?siteId=${e}`}}function I(){return{open:!1,presence:"connecting",messages:[],visitorTyping:!1,remoteTyping:!1,unread:0}}function B(){return`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4 12C4 7.58 7.58 4 12 4s8 3.58 8 8-3.58 8-8 8c-1.13 0-2.2-.23-3.18-.66L4 20l1.02-4.06A7.94 7.94 0 0 1 4 12Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`}function F(){return`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4 12.5 20 4l-6.5 17-2.5-7-7-1.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
  </svg>`}function P(){return`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`}function $(e){return e==="agent-online"?'<span class="pill agent"><span class="pill-dot"></span>Agent online</span>':e==="ai-only"?'<span class="pill ai"><span class="pill-dot"></span>AI assistant</span>':e==="connecting"?'<span class="pill connecting"><span class="pill-dot"></span>Connecting\u2026</span>':'<span class="pill connecting"><span class="pill-dot"></span>Offline</span>'}function q(e){return e.role==="agent"?"Agent":e.role==="ai"?"AI Assistant":""}function b(e){let r=document.createElement("div");return r.textContent=e,r.innerHTML}function z(e,r,n){let t=I(),d=document.createElement("style");d.textContent=C,e.appendChild(d);let a=document.createElement("div");a.innerHTML=`
    <button class="launcher" type="button" aria-label="Open chat" aria-expanded="false">
      ${B()}
      <span class="badge" hidden></span>
    </button>
    <div class="panel" role="dialog" aria-label="${b(r.companyName)} chat">
      <div class="header">
        <div class="header-info">
          <span class="company-name">${b(r.companyName)}</span>
          <span class="presence-pill"></span>
        </div>
        <button class="close-btn" type="button" aria-label="Close chat">${P()}</button>
      </div>
      <div class="messages" aria-live="polite"></div>
      <div class="composer">
        <textarea rows="1" placeholder="Type a message\u2026" aria-label="Message"></textarea>
        <button class="send-btn" type="button" aria-label="Send message" disabled>${F()}</button>
      </div>
      <div class="footer-note">Powered by PulseDesk</div>
    </div>
  `,e.appendChild(a);let c=a.querySelector(".launcher"),u=a.querySelector(".badge"),m=a.querySelector(".panel"),v=a.querySelector(".presence-pill"),y=a.querySelector(".close-btn"),p=a.querySelector(".messages"),l=a.querySelector("textarea"),o=a.querySelector(".send-btn");function s(i){t={...t,...i},w()}function f(){let i=p.scrollHeight-p.scrollTop-p.clientHeight<60;p.innerHTML=t.messages.map(g=>{let x=g.role==="visitor"?"visitor":"other",M=q(g);return`
          <div class="row ${x}">
            ${M?`<span class="sender-label">${M}</span>`:""}
            <div class="bubble">${b(g.text)}</div>
          </div>
        `}).join(""),t.remoteTyping&&p.insertAdjacentHTML("beforeend",`<div class="row other"><div class="typing-bubble" aria-label="Assistant is typing">
          <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
        </div></div>`),(i||t.messages.length<=1)&&(p.scrollTop=p.scrollHeight)}function w(){m.classList.toggle("open",t.open),c.setAttribute("aria-expanded",String(t.open)),v.innerHTML=$(t.presence),u.hidden=t.unread===0||t.open,u.textContent=String(t.unread),o.disabled=l.value.trim().length===0,f()}function h(i){s({open:i,unread:i?0:t.unread}),i&&window.setTimeout(()=>l.focus(),50)}c.addEventListener("click",()=>h(!t.open)),y.addEventListener("click",()=>h(!1)),document.addEventListener("keydown",i=>{i.key==="Escape"&&t.open&&h(!1)}),l.addEventListener("input",()=>{o.disabled=l.value.trim().length===0,l.style.height="auto",l.style.height=`${Math.min(l.scrollHeight,88)}px`,n.setVisitorTyping(l.value.length>0)});function k(){let i=l.value.trim();i&&(n.sendMessage(i),l.value="",l.style.height="auto",o.disabled=!0,n.setVisitorTyping(!1))}o.addEventListener("click",k),l.addEventListener("keydown",i=>{i.key==="Enter"&&!i.shiftKey&&(i.preventDefault(),k())}),n.onPresence(i=>s({presence:i})),n.onMessage(i=>{let g=[...t.messages,i],x=i.role!=="visitor";s({messages:g,remoteTyping:!1,unread:x&&!t.open?t.unread+1:t.unread})}),n.onRemoteTyping(i=>s({remoteTyping:i})),w(),n.connect()}function E(){let e=A();if(!e){console.error("[PulseDesk] Missing data-site-id on the widget <script> tag.");return}let r=H();if(!r){console.error("[PulseDesk] Missing data-site-id on the widget <script> tag.");return}let n=D(e,r),t=S(n),d=document.createElement("div");d.id="pulsedesk-widget-root",document.body.appendChild(d);let a=d.attachShadow({mode:"open"});z(a,n,t)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",E):E();})();
