/* pbp.js – Play-by-Play Creator logic */

const SK = 'pbp_creator_v3';
const NP = new Set(['punt', 'kick', 'penalty', 'timeout', 'xp']);
const QL = ['', 'Q1', 'Q2', 'Q3', 'Q4', 'OT'];
const TL = { pass: 'PASS', inc: 'INCOMPLETE', sack: 'SACK', rush: 'RUSH', td: 'TOUCHDOWN', xp: 'EXTRA POINT', fg: 'FIELD GOAL', punt: 'PUNT', kick: 'KICKOFF', turnover: 'TURNOVER', penalty: 'PENALTY', timeout: 'TIMEOUT', other: 'OTHER' };

// State
let state = {
    awayName: '', awayCity: '', homeName: '', homeCity: '',
    quarterScores: { away: [0, 0, 0, 0, 0], home: [0, 0, 0, 0, 0] },
    awayTotal: 0, homeTotal: 0,
    gameTime: '', gameVenue: '', gameName: '', gameWeather: '',
    activeQ: 1, currentDriveId: 1,
    drives: {},
    plays: [],
    highlightedPlayIds: []
};

// UI state (not persisted)
let editingPlayId = null, pendingDeleteId = null, insertAfterPlayId = null;

/* ─── Persist ─────────────────────────────── */
function loadState() { try { const r = localStorage.getItem(SK); if (r) state = { ...state, ...JSON.parse(r) }; } catch (e) { } }
function persist() { localStorage.setItem(SK, JSON.stringify(state)); }

function saveGame() {
    state.awayName = _v('awayName'); state.awayCity = _v('awayCity');
    state.homeName = _v('homeName'); state.homeCity = _v('homeCity');
    state.awayTotal = parseInt(_v('awayTotal')) || 0;
    state.homeTotal = parseInt(_v('homeTotal')) || 0;
    state.gameTime = _v('gameTime');
    state.gameVenue = _v('gameVenue');
    state.gameName = _v('gameName');
    state.gameWeather = _v('gameWeather');
    ['away', 'home'].forEach((t, ti) => {
        const p = ti === 0 ? 'a' : 'h';
        state.quarterScores[t] = [0, 1, 2, 3, 4].map(i => parseInt(_v(p + 'q' + i)) || 0);
    });
    persist();
}
function _v(id) { return document.getElementById(id).value; }

/* ─── Sync UI ─────────────────────────────── */
function syncUI() {
    document.getElementById('awayName').value = state.awayName;
    document.getElementById('awayCity').value = state.awayCity;
    document.getElementById('homeName').value = state.homeName;
    document.getElementById('homeCity').value = state.homeCity;
    document.getElementById('awayTotal').value = state.awayTotal;
    document.getElementById('homeTotal').value = state.homeTotal;
    document.getElementById('gameTime').value = state.gameTime || '';
    document.getElementById('gameVenue').value = state.gameVenue || '';
    document.getElementById('gameName').value = state.gameName || '';
    document.getElementById('gameWeather').value = state.gameWeather || '';
    ['away', 'home'].forEach((t, ti) => {
        const p = ti === 0 ? 'a' : 'h';
        state.quarterScores[t].forEach((v, i) => { document.getElementById(p + 'q' + i).value = v; });
    });
    setQ(state.activeQ, false);
    updatePossOpts();
    renderPBP();
}

/* ─── Quarter ─────────────────────────────── */
function setQ(q, save = true) {
    state.activeQ = q;
    [1, 2, 3, 4, 5].forEach(i => document.getElementById('qb' + i).classList.toggle('active', i === q));
    if (save) persist();
}

function updatePossOpts() {
    const s = document.getElementById('frm_poss');
    s.options[1].text = state.awayName || 'AWAY';
    s.options[2].text = state.homeName || 'HOME';
}

/* ─── Add / Update / Insert Play ─────────── */
function submitPlay() {
    const desc = document.getElementById('frm_desc').value.trim();
    if (!desc) { toast('説明文を入力してください', '#ff4444'); return; }
    const data = {
        quarter: state.activeQ,
        time: _v('inp_time').trim(), down: _v('inp_down').trim(),
        dist: _v('inp_dist').trim(), yardline: _v('inp_yardline').trim(),
        team: _v('frm_poss'), type: _v('frm_type'),
        desc, scoreUpdate: _v('frm_score').trim()
    };
    if (editingPlayId !== null) {
        const idx = state.plays.findIndex(p => p.id === editingPlayId);
        if (idx !== -1) state.plays[idx] = { ...state.plays[idx], ...data };
        toast('✅ プレイを更新しました'); cancelEdit();
    } else if (insertAfterPlayId !== null) {
        const idx = state.plays.findIndex(p => p.id === insertAfterPlayId);
        const ref = state.plays[idx];
        state.plays.splice(idx + 1, 0, { id: Date.now(), driveId: ref ? ref.driveId : state.currentDriveId, ...data });
        toast('↓ プレイを挿入しました'); clearInsertMode();
    } else {
        state.plays.push({ id: Date.now(), driveId: state.currentDriveId, ...data });
        toast('✅ プレイを追加しました');
    }
    clearForm(); persist(); renderPBP();
    
    // 追加・更新後、リストを一番下にスクロールして最新を見えるようにする
    setTimeout(() => {
        const list = document.getElementById('pbpList');
        if (list) list.scrollTop = list.scrollHeight;
    }, 50);
}

function clearForm() {
    ['frm_desc', 'frm_score', 'inp_time', 'inp_down', 'inp_dist', 'inp_yardline'].forEach(id => document.getElementById(id).value = '');
}

/* ─── Edit mode ───────────────────────────── */
function startEdit(id) {
    const p = state.plays.find(x => x.id === id); if (!p) return;
    editingPlayId = id; insertAfterPlayId = null;
    document.getElementById('frm_poss').value = p.team || '';
    document.getElementById('frm_type').value = p.type || 'pass';
    document.getElementById('frm_desc').value = p.desc || '';
    document.getElementById('frm_score').value = p.scoreUpdate || '';
    document.getElementById('inp_time').value = p.time || '';
    document.getElementById('inp_down').value = p.down || '';
    document.getElementById('inp_dist').value = p.dist || '';
    document.getElementById('inp_yardline').value = p.yardline || '';
    setQ(p.quarter || 1);
    setFormMode('✏️ Edit Play', '✅ プレイを更新', true);
    renderPBP(); document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function cancelEdit() { editingPlayId = null; insertAfterPlayId = null; clearForm(); setFormMode('＋ Add Play', '＋ プレイを追加', false); renderPBP(); }

/* ─── Insert After mode ──────────────────── */
function startInsertAfter(id) {
    insertAfterPlayId = id; editingPlayId = null;
    clearForm(); setFormMode('↓ プレイをここに挿入', '↓ 挿入する', true);
    renderPBP(); document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function clearInsertMode() { insertAfterPlayId = null; setFormMode('＋ Add Play', '＋ プレイを追加', false); }

function setFormMode(title, btnText, showCancel) {
    document.getElementById('fmTitle').textContent = title;
    document.getElementById('submitBtn').textContent = btnText;
    document.getElementById('cancelBtn').style.display = showCancel ? 'flex' : 'none';
}

/* ─── Delete ──────────────────────────────── */
function askDel(id) {
    pendingDeleteId = id;
    const p = state.plays.find(x => x.id === id);
    document.getElementById('delDesc').textContent = p ? `「${p.desc.slice(0, 60)}${p.desc.length > 60 ? '…' : ''}」を削除します。取り消せません。` : 'このプレイを削除します。';
    document.getElementById('delMo').classList.add('open');
}
function confirmDel() {
    if (pendingDeleteId !== null) { state.plays = state.plays.filter(p => p.id !== pendingDeleteId); persist(); renderPBP(); toast('🗑 削除しました', '#ff4444'); }
    pendingDeleteId = null; closeMo('delMo');
}

/* ─── Highlight (multiple, persisted) ────── */
function toggleHL(id) {
    const arr = state.highlightedPlayIds;
    const i = arr.indexOf(id);
    if (i === -1) arr.push(id); else arr.splice(i, 1);
    persist(); renderPBP();
}

/* ─── Drive ───────────────────────────────── */
function endDrive() {
    if (state.plays.filter(p => p.driveId === state.currentDriveId).length === 0) {
        toast('現在のドライブにプレイがありません', '#ff4444'); return;
    }
    if (!state.drives[state.currentDriveId])
        state.drives[state.currentDriveId] = { team: '', result: '', yards: '', driveTime: '', score: '', collapsed: false };
    state.currentDriveId++;
    persist(); renderPBP(); toast('🏁 ドライブを終了しました');
}
function toggleDrive(did) {
    if (!state.drives[did]) return;
    state.drives[did].collapsed = !state.drives[did].collapsed;
    persist(); renderPBP();
}

/* Drive metadata change handler (event delegation) */
document.getElementById('pbpList').addEventListener('change', e => {
    const d = e.target.dataset.drive, f = e.target.dataset.field;
    if (d && f) { const did = parseInt(d); if (!state.drives[did]) return; state.drives[did][f] = e.target.value; persist(); if (f === 'team') renderPBP(); }
});
document.getElementById('pbpList').addEventListener('input', e => {
    const d = e.target.dataset.drive, f = e.target.dataset.field;
    if (d && f && f !== 'team') { const did = parseInt(d); if (!state.drives[did]) return; state.drives[did][f] = e.target.value; persist(); }
});

/* ─── Render PBP ──────────────────────────── */
function teamLabel(k) { return k === 'away' ? state.awayName || 'AWAY' : k === 'home' ? state.homeName || 'HOME' : ''; }
function teamColor(k) { return k === 'home' ? 'var(--a2)' : 'var(--ac)'; }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function renderPBP() {
    const plays = state.plays;
    const total = plays.filter(p => !NP.has(p.type)).length;
    document.getElementById('pbpCount').textContent = total + ' play' + (total !== 1 ? 's' : '');

    if (plays.length === 0) {
        document.getElementById('pbpList').innerHTML = '<div class="empty"><div class="empty-ic">🏈</div><div>右のフォームからプレイを追加してください</div></div>';
        return;
    }

    // Group by driveId
    const driveOrder = [], driveMap = {};
    plays.forEach(p => { const d = p.driveId || 1; if (!driveMap[d]) { driveMap[d] = []; driveOrder.push(d); } driveMap[d].push(p); });

    let html = '', prevLastQ = null;

    driveOrder.forEach((did, di) => {
        const dPlays = driveMap[did];
        const dCounted = dPlays.filter(p => !NP.has(p.type)).length;
        const isEnded = !!state.drives[did];
        const dmeta = state.drives[did] || {};
        const collapsed = isEnded && dmeta.collapsed;
        const away = state.awayName || 'AWAY', home = state.homeName || 'HOME';

        // Halftime check (between Q2 and Q3) — and normal drive end sep
        if (di > 0 && prevLastQ !== null) {
            const firstQ = dPlays[0]?.quarter || 1;
            if (prevLastQ === 2 && firstQ >= 3) {
                html += `<div class="halftime-sep"><div class="sep-line sep-line-h"></div><span class="sep-lbl sep-lbl-h">HALFTIME</span><div class="sep-line sep-line-h"></div></div>`;
            } else {
                html += `<div class="drive-end-sep"><div class="sep-line sep-line-r"></div><span class="sep-lbl sep-lbl-r">Drive ${di} End</span><div class="sep-line sep-line-r"></div></div>`;
            }
        }
        prevLastQ = dPlays[dPlays.length - 1]?.quarter || 1;

        if (isEnded) {
            // Ended drive: collapsible header
            const teamOpts = `<option value=""${!dmeta.team ? ' selected' : ''}>—</option><option value="away"${dmeta.team === 'away' ? ' selected' : ''}>${esc(away)}</option><option value="home"${dmeta.team === 'home' ? ' selected' : ''}>${esc(home)}</option>`;
            html += `<div class="deh">
        <button class="dtog" onclick="toggleDrive(${did})">${collapsed ? '▶' : '▼'}</button>
        <select class="dteam" data-drive="${did}" data-field="team" title="チームを選択" style="color:${dmeta.team ? teamColor(dmeta.team) : 'var(--mt)'}">${teamOpts}</select>
        <span class="d-sep">|</span>
        <input class="dmi dmi-r" data-drive="${did}" data-field="result" value="${esc(dmeta.result || '')}" placeholder="Result..."/>
        <span class="d-sep">·</span>
        <span class="d-pc">${dCounted} plays</span>
        <span class="d-sep">·</span>
        <input class="dmi dmi-n" data-drive="${did}" data-field="yards" value="${esc(dmeta.yards || '')}" placeholder="Yds" type="number"/>
        <span style="font-size:.74rem;color:var(--mt)">yds</span>
        <span class="d-sep">·</span>
        <input class="dmi dmi-n" data-drive="${did}" data-field="driveTime" value="${esc(dmeta.driveTime || '')}" placeholder="0:00"/>
        <span class="d-sep">·</span>
        <input class="dmi dmi-s" data-drive="${did}" data-field="score" value="${esc(dmeta.score || '')}" placeholder="スコア"/>
      </div>`;
            if (!collapsed) { html += renderDrivePlays(dPlays, di + 1, false); }
        } else {
            // Current (in-progress) drive header
            html += `<div class="dch"><span class="dch-lbl">DRIVE ${di + 1} <span style="font-size:.6rem;color:var(--gn)">▶ IN PROGRESS</span></span><span class="dch-cnt">${dCounted} plays</span><div class="dch-line"></div></div>`;
            html += renderDrivePlays(dPlays, di + 1, true);
        }
    });

    document.getElementById('pbpList').innerHTML = html;
}

function renderDrivePlays(dPlays, driveNum, isCurrent) {
    const hlIds = state.highlightedPlayIds;
    let html = '';
    dPlays.forEach(p => {
        const isHL = hlIds.includes(p.id);
        const isED = editingPlayId === p.id;
        const isIA = insertAfterPlayId === p.id;
        let cls = 'play-item';
        if (isHL) cls += ' hl'; if (isED) cls += ' editing'; if (isIA) cls += ' inserting';
        const tKey = p.type || 'other';
        const dnDist = [p.down, p.dist ? `& ${p.dist}` : ''].filter(Boolean).join(' ');
        const sit = [dnDist, p.yardline ? `at ${p.yardline}` : ''].filter(Boolean).join(' ');
        const badge = p.team ? `<div class="pt-badge" style="background:${teamColor(p.team)}22;color:${teamColor(p.team)}">${esc(teamLabel(p.team))}</div>` : '';
        const scoreRow = p.scoreUpdate ? `<div class="pt-sc">🏆 ${esc(p.scoreUpdate)}</div>` : '';
        const qLabel = p.quarter ? `<span class="pt-ql">${QL[p.quarter] || 'Q?'}</span> ` : '';

        html += `<div class="${cls}" id="pi${p.id}">
      <div><button class="hl-btn${isHL ? ' on' : ''}" onclick="toggleHL(${p.id})"><span class="hl-dot"></span></button></div>
      <div class="pt-col">
        <div>${qLabel}<span class="pt-time">${esc(p.time) || '—'}</span></div>
        <div class="pt-dd">${esc(sit) || '—'}</div>
        ${badge}
      </div>
      <div>
        <span class="pt-tag tg-${tKey}">${TL[tKey] || tKey.toUpperCase()}</span>
        <div class="pt-desc">${esc(p.desc)}</div>
        ${scoreRow}
      </div>
      <div class="play-acts">
        <button class="ab ab-del" onclick="askDel(${p.id})" title="削除">✕</button>
        <button class="ab ab-edit" onclick="startEdit(${p.id})" title="編集">✏️</button>
        <button class="ab ab-ins" onclick="startInsertAfter(${p.id})" title="この下に挿入">↓</button>
      </div>
    </div>`;
    });
    return html;
}

/* ─── Modals ──────────────────────────────── */
function openNewGameModal() { document.getElementById('newGameMo').classList.add('open'); }
function closeMo(id) { document.getElementById(id).classList.remove('open'); }
function confirmNew() {
    state = {
        awayName: '', awayCity: '', homeName: '', homeCity: '',
        quarterScores: { away: [0, 0, 0, 0, 0], home: [0, 0, 0, 0, 0] },
        awayTotal: 0, homeTotal: 0,
        gameTime: '', gameVenue: '', gameName: '', gameWeather: '',
        activeQ: 1, currentDriveId: 1, drives: {}, plays: [], highlightedPlayIds: []
    };
    persist(); syncUI(); closeMo('newGameMo'); toast('🆕 新しいゲームを開始しました');
}

/* ─── Save as HTML ────────────────────────── */
function saveAsHTML() {
    const away = state.awayName || 'AWAY', home = state.homeName || 'HOME';
    const aqs = state.quarterScores.away, hqs = state.quarterScores.home;
    const hlIds = state.highlightedPlayIds;
    function se(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    function tl(k) { return k === 'away' ? away : k === 'home' ? home : ''; }
    function tc(k) { return k === 'home' ? '#6d3fd4' : '#0090c8'; }
    const tcMap = {pass:'rgba(0,144,200,.14);color:#0090c8',inc:'rgba(229,62,62,.14);color:#e53e3e',sack:'rgba(220,90,0,.14);color:#c05500',rush:'rgba(22,163,74,.14);color:#16a34a',td:'rgba(217,119,6,.18);color:#d97706',xp:'rgba(217,119,6,.10);color:#a06010',fg:'rgba(109,63,212,.14);color:#6d3fd4',punt:'rgba(100,116,139,.15);color:#64748b',kick:'rgba(100,116,139,.15);color:#64748b',turnover:'rgba(229,62,62,.18);color:#b91c1c',penalty:'rgba(229,62,62,.12);color:#e53e3e',timeout:'rgba(217,119,6,.12);color:#d97706',other:'rgba(100,116,139,.12);color:#64748b'};

    const driveOrder = [], driveMap = {};
    state.plays.forEach(p => { const d = p.driveId || 1; if (!driveMap[d]) { driveMap[d] = []; driveOrder.push(d); } driveMap[d].push(p); });

    let playsHTML = '';
    if (state.plays.length === 0) { playsHTML = '<div style="padding:40px;text-align:center;color:#6b7280">No plays recorded.</div>'; }
    else {
        let prevQ = null;
        driveOrder.forEach((did, di) => {
            const dp = driveMap[did]; const dm = state.drives[did] || {};
            const dCount = dp.filter(p => !NP.has(p.type)).length;
            const firstQ = dp[0]?.quarter || 1;
            if (di > 0) {
                if (prevQ === 2 && firstQ >= 3) { playsHTML += `<div style="padding:10px 18px;display:flex;align-items:center;gap:11px;background:linear-gradient(90deg,rgba(255,202,40,.06),rgba(124,77,255,.06));border-top:2px solid rgba(255,202,40,.3);border-bottom:2px solid rgba(255,202,40,.3)"><div style="flex:1;height:1px;background:rgba(255,202,40,.2)"></div><span style="font-family:'Orbitron',sans-serif;font-size:.72rem;color:#ffca28;letter-spacing:2px">HALFTIME</span><div style="flex:1;height:1px;background:rgba(255,202,40,.2)"></div></div>`; }
                else { playsHTML += `<div style="padding:8px 18px;display:flex;align-items:center;gap:11px;background:rgba(255,68,68,.04);border-top:1px solid rgba(255,68,68,.22);border-bottom:1px solid rgba(255,68,68,.22)"><div style="flex:1;height:1px;background:rgba(255,68,68,.2)"></div><span style="font-size:.68rem;font-weight:700;color:#ff4444;letter-spacing:1.5px;opacity:.7">DRIVE ${di} END</span><div style="flex:1;height:1px;background:rgba(255,68,68,.2)"></div></div>`; }
            }
            prevQ = dp[dp.length - 1]?.quarter || 1;
            const teamClr = dm.team ? tc(dm.team) : '#6b7280';
            playsHTML += `<div style="display:flex;align-items:center;gap:8px;padding:9px 14px;background:#1c2030;border-bottom:1px solid #2a2f45;flex-wrap:wrap">
        <span style="font-family:'Orbitron',sans-serif;font-size:1rem;font-weight:700;color:${teamClr};text-transform:uppercase;min-width:60px">${se(dm.team ? tl(dm.team) : '—')}</span>
        <span style="color:#2a2f45">|</span><span style="font-size:.78rem;color:#e8eaf6">${se(dm.result || '—')}</span>
        <span style="color:#2a2f45">·</span><span style="font-size:.7rem;color:#6b7280">${dCount} plays</span>
        ${dm.yards ? `<span style="color:#2a2f45">·</span><span style="font-size:.76rem;color:#e8eaf6">${se(dm.yards)} yds</span>` : ''} 
        ${dm.driveTime ? `<span style="color:#2a2f45">·</span><span style="font-size:.76rem;color:#e8eaf6">${se(dm.driveTime)}</span>` : ''}
        ${dm.score ? `<span style="color:#2a2f45">·</span><span style="font-size:.76rem;color:#ffca28;font-weight:600">${se(dm.score)}</span>` : ''}
      </div>`;
            dp.forEach(p => {
                const tKey = p.type || 'other'; const isHL = hlIds.includes(p.id);
                const dnDist = [p.down, p.dist ? '& ' + p.dist : ''].filter(Boolean).join(' ');
                const sit = [dnDist, p.yardline ? 'at ' + p.yardline : ''].filter(Boolean).join(' ');
                const badge = p.team ? `<div style="display:inline-block;font-size:.6rem;font-weight:700;padding:1px 5px;border-radius:3px;background:${tc(p.team)}22;color:${tc(p.team)};text-transform:uppercase;margin-top:3px">${se(tl(p.team))}</div>` : '';
                const scoreRow = p.scoreUpdate ? `<div style="font-size:.71rem;color:#ffca28;font-weight:600;margin-top:3px">🏆 ${se(p.scoreUpdate)}</div>` : '';
                const hlStyle = isHL ? 'border-left:3px solid #00d4ff;background:rgba(0,212,255,.07);' : '';
                playsHTML += `<div style="padding:11px 14px;border-bottom:1px solid rgba(42,47,69,.5);display:grid;grid-template-columns:82px 1fr;gap:9px;align-items:start;${hlStyle}">
          <div style="text-align:center">
            <div>${p.quarter ? `<span style="font-size:.6rem;color:#6b7280;font-weight:600">${QL[p.quarter] || ''} </span>` : ''}<span style="font-family:'Orbitron',sans-serif;font-size:.76rem;color:#00d4ff;font-weight:700">${se(p.time) || '—'}</span></div>
            <div style="font-size:.66rem;color:#6b7280;margin-top:2px">${se(sit) || '—'}</div>${badge}
          </div>
          <div>
            <span style="display:inline-block;font-size:.63rem;font-weight:700;padding:2px 6px;border-radius:4px;text-transform:uppercase;letter-spacing:.5px;background:${tcMap[tKey]||tcMap.other};margin-bottom:4px">${TL[tKey]||tKey.toUpperCase()}</span>
            <div style="font-size:.84rem;line-height:1.55;color:#1e293b">${se(p.desc)}</div>${scoreRow}
          </div>
        </div>`;
            });
        });
    }

    const qRow = (qs) => qs.map(v => `<td style="text-align:center;padding:5px 7px;border-bottom:1px solid #d1d9e6">${v}</td>`).join('');
    const fn = `pbp_${away}_vs_${home}_${new Date().toISOString().slice(0, 10)}.html`.replace(/[^a-zA-Z0-9_.\-]/g, '_');
    const doc = `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>🏈 ${se(away)} vs ${se(home)} – Play by Play</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Orbitron:wght@700&display=swap" rel="stylesheet"/>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',sans-serif;background:#f5f7fb;color:#1e293b;min-height:100vh;padding-bottom:40px}</style>
</head><body>
<div style="background:linear-gradient(135deg,#fff,#f0f4ff);border-bottom:1px solid #d1d9e6;padding:13px 18px;display:flex;align-items:center;gap:10px;box-shadow:0 1px 6px rgba(0,0,0,.06)">
  <span style="font-family:'Orbitron',sans-serif;font-size:1rem;color:#0090c8;letter-spacing:2px">🏈 PBP Creator</span>
  <span style="font-size:.72rem;color:#64748b">Saved ${new Date().toLocaleString('ja-JP')}</span>
</div>
<div style="max-width:860px;margin:20px auto;padding:0 14px">
  <div style="background:#fff;border:1px solid #d1d9e6;border-radius:12px;overflow:hidden;margin-bottom:16px">
    <div style="background:linear-gradient(135deg,#eef4ff,#f0f7ff);padding:13px 17px">
      <table style="width:100%;border-collapse:collapse;font-family:'Inter',sans-serif">
        <thead><tr style="font-size:.67rem;font-weight:700;color:#64748b;text-transform:uppercase">
          <th style="text-align:left;padding:4px 7px;border-bottom:1px solid #d1d9e6;min-width:110px">TEAM</th>
          <th style="padding:4px 7px;border-bottom:1px solid #d1d9e6">Q1</th><th style="padding:4px 7px;border-bottom:1px solid #d1d9e6">Q2</th><th style="padding:4px 7px;border-bottom:1px solid #d1d9e6">Q3</th><th style="padding:4px 7px;border-bottom:1px solid #d1d9e6">Q4</th><th style="padding:4px 7px;border-bottom:1px solid #d1d9e6">OT</th><th style="padding:4px 7px;border-bottom:1px solid #d1d9e6">T</th>
        </tr></thead>
        <tbody>
          <tr><td style="padding:5px 7px"><div style="font-size:.9rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#1e293b">${se(away)}</div><div style="font-size:.68rem;color:#64748b">${se(state.awayCity)}</div></td>${qRow(aqs)}<td style="text-align:center;padding:5px 10px;font-family:'Orbitron',sans-serif;font-size:1.1rem;font-weight:700;color:#0090c8">${state.awayTotal}</td></tr>
          <tr><td style="padding:5px 7px"><div style="font-size:.9rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#1e293b">${se(home)}</div><div style="font-size:.68rem;color:#64748b">${se(state.homeCity)}</div></td>${qRow(hqs)}<td style="text-align:center;padding:5px 10px;font-family:'Orbitron',sans-serif;font-size:1.1rem;font-weight:700;color:#6d3fd4">${state.homeTotal}</td></tr>
        </tbody>
      </table>
      ${(state.gameTime||state.gameVenue||state.gameName||state.gameWeather)?`<div style="display:flex;flex-wrap:wrap;gap:8px 18px;padding:10px 14px 12px;border-top:1px solid #d1d9e6;margin-top:8px">${state.gameTime?`<span style="font-size:.75rem;color:#64748b">🗓 <span style="color:#1e293b">${se(state.gameTime)}</span></span>`:''} ${state.gameVenue?`<span style="font-size:.75rem;color:#64748b">🏟 <span style="color:#1e293b">${se(state.gameVenue)}</span></span>`:''} ${state.gameName?`<span style="font-size:.75rem;color:#64748b">🏆 <span style="color:#1e293b">${se(state.gameName)}</span></span>`:''} ${state.gameWeather?`<span style="font-size:.75rem;color:#64748b">🌤 <span style="color:#1e293b">${se(state.gameWeather)}</span></span>`:''}</div>`:""}
    </div>
  </div>
  <div style="background:#fff;border:1px solid #d1d9e6;border-radius:12px;overflow:hidden">
    <div style="padding:11px 16px;background:#eef2f8;border-bottom:1px solid #d1d9e6;display:flex;align-items:center;justify-content:space-between">
      <span style="font-size:.86rem;font-weight:700;letter-spacing:.5px;color:#1e293b">PLAY BY PLAY</span>
      <span style="font-size:.72rem;color:#64748b;background:#f5f7fb;padding:2px 8px;border-radius:20px">${state.plays.filter(p=>!NP.has(p.type)).length} plays</span>
    </div>
    ${playsHTML}
  </div>
</div></body></html>`;

    const blob = new Blob([doc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = fn;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    toast('💾 HTMLファイルを保存しました');
}

/* ─── Toast ───────────────────────────────── */
let tt;
function toast(msg, bg) {
    const el = document.getElementById('toast');
    el.textContent = msg; el.style.background = bg || 'var(--gn)';
    el.classList.add('show'); clearTimeout(tt);
    tt = setTimeout(() => el.classList.remove('show'), 2500);
}

/* ─── JSON Export ─────────────────────────── */
function exportJSON() {
    const away = state.awayName || 'AWAY', home = state.homeName || 'HOME';
    const fn = `pbp_${away}_vs_${home}_${new Date().toISOString().slice(0, 10)}.json`
        .replace(/[^a-zA-Z0-9_.\-]/g, '_');
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = fn;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    toast('📤 JSONを保存しました');
}

/* ─── JSON Import ─────────────────────────── */
function importJSON() {
    document.getElementById('jsonFileInput').click();
}

function handleJSONImport(input) {
    const file = input.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
        try {
            const loaded = JSON.parse(ev.target.result);
            // 必須キーが存在するか簡易チェック
            if (!loaded.plays || !loaded.quarterScores) throw new Error('invalid');
            state = { ...state, ...loaded };
            persist(); syncUI();
            toast('📥 JSONを読み込みました');
        } catch (e) {
            toast('❌ ファイルの読み込みに失敗しました', '#ff4444');
        }
    };
    reader.readAsText(file);
    input.value = ''; // 同じファイルを再インポートできるようリセット
}

/* ─── Init ────────────────────────────────── */
loadState(); syncUI();

