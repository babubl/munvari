/* MunVari — Ask: tax Q&A chatbot powered by Puter.js (each user signs in to Puter; no MunVari server).
 * Grounded with MunVari's own reference data so answers cite the right sections. History lives in memory only.
 */
(function () {
  const $ = id => document.getElementById(id);
  const L = window.LAW;
  const history = [];
  let busy = false;

  /* ---------- grounding ---------- */
  function knowledge() {
    const secs = L.sections.map(x => `- Sec ${x.s} (old ${x.o}) ${x.t}: ${x.d}`).join('\n');
    const chs = L.chapters.map(c => `- Chapter ${c.n} ${c.title} (Sec ${c.from}-${c.to})`).join('\n');
    const sch = L.schedules.map(s => `- Schedule ${s.n} ${s.title}: ${s.about}`).join('\n');
    const forms = L.forms.map(f => `- ${f.f} (old ${f.o}) ${f.t}: ${f.d}`).join('\n');
    const due = L.dueDates.map(d => `- ${d.who}: ${d.when}`).join('\n');
    return `REFERENCE (MunVari, verified 12 Nov 2026)
Law: Income-tax Act, 2025 (536 sections, 23 chapters, 16 schedules), in force from 1 April 2026, replacing the Income-tax Act, 1961. Income-tax Rules, 2026 (333 rules, 190 forms). "Tax year" replaces previous year/assessment year; tax year 2026-27 = 1 Apr 2026 to 31 Mar 2027 (portal may show AY 2027-28).

Rates for tax year 2026-27 (individuals):
- New regime (default, Sec 202): 0-4L nil; 4-8L 5%; 8-12L 10%; 12-16L 15%; 16-20L 20%; 20-24L 25%; above 24L 30%. Standard deduction Rs 75,000. Rebate (Sec 156) makes tax nil up to Rs 12L income (Rs 12.75L salary), with marginal relief; not against 111A/112A tax.
- Old regime: 0-2.5L nil (3L age 60-79, 5L age 80+); 2.5-5L 5%; 5-10L 20%; above 10L 30%. Standard deduction Rs 50,000. Rebate up to Rs 12,500 if income up to Rs 5L.
- Surcharge: 10% above 50L, 15% above 1Cr, 25% above 2Cr, 37% above 5Cr (old regime only); capped at 15% on equity capital gains and dividends; marginal relief applies. Cess 4%.
- Capital gains: listed equity STCG 20% (Sec 196); listed equity LTCG 12.5% above Rs 1.25L (Sec 198); other LTCG 12.5% (Sec 197); debt MFs bought from 1 Apr 2023 always slab rate.
- Advance tax: if tax after TDS is Rs 10,000+; 15% by 15 Jun, 45% by 15 Sep, 75% by 15 Dec, 100% by 15 Mar; presumptive taxpayers pay all by 15 Mar; resident seniors without business income exempt. Interest 1%/month (Sec 424, 425).
- Partnership firms/LLPs: flat 30%, surcharge 12% above 1Cr, cess 4%. HUFs: individual slabs, no rebate.

Key sections:
${secs}

Chapters:
${chs}

Schedules:
${sch}

Forms (Income-tax Rules, 2026 numbering; ask users to confirm on the portal):
${forms}

Return due dates, tax year 2026-27:
${due}`;
  }

  const SYSTEM = () => `You are MunVari Ask, a helpful assistant that explains Indian income tax law and return filing for individuals, HUFs and small businesses.

How to answer:
- Answer for India and tax year 2026-27 unless the user names another year. For earlier years, say the 1961 Act applied.
- Lead with the direct answer, then the key conditions, in short paragraphs or bullets. Keep it under about 200 words unless the user asks for detail. Use Rs or ₹ with Indian digit grouping.
- Cite law as "Sec <new> (old <1961 number>)". Use ONLY section numbers that appear in the reference below. If a provision isn't in the reference, cite only the 1961 number and label it "(1961 Act numbering)". Never guess a new section number.
- If a rule is uncertain, has changed recently, or depends on facts you don't have, say so plainly and ask one short clarifying question.
- Show a quick worked example when it helps.
- For an advance tax amount or regime comparison on the user's own numbers, suggest the MunVari calculator (link: ./).
- This is general information, not advice for the user's specific case. For scrutiny notices, penalties, prosecution, international tax or large amounts, recommend a Chartered Accountant.
- Don't recommend specific mutual funds, stocks, insurance policies or other financial products, and don't promise returns. You may explain how a type of investment is taxed.
- Never ask for PAN, Aadhaar, bank details or passwords. If the user shares them, tell them not to.
- Decline requests to evade tax or hide income; you can explain the legal options instead.

${knowledge()}`;

  /* ---------- safe markdown ---------- */
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function inline(s) {
    return s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*]+)\*/g, '$1<i>$2</i>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\.\/[^)\s]*|[a-z]+\.html[^)\s]*)\)/g, (m, t, u) => `<a href="${u}"${u.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`);
  }
  function md(src) {
    const lines = esc(src).split('\n'); let out = '', list = null, table = [];
    const flushList = () => { if (list) { out += `</${list}>`; list = null; } };
    const flushTable = () => {
      if (!table.length) return;
      const rows = table.filter(r => !/^\s*\|?\s*:?-{2,}/.test(r));
      out += '<table>' + rows.map((r, i) => '<tr>' + r.replace(/^\||\|$/g, '').split('|').map(c => `<${i ? 'td' : 'th'}>${inline(c.trim())}</${i ? 'td' : 'th'}>`).join('') + '</tr>').join('') + '</table>';
      table = [];
    };
    for (const raw of lines) {
      const l = raw.trimEnd();
      if (/^\s*\|.*\|\s*$/.test(l)) { flushList(); table.push(l.trim()); continue; } else flushTable();
      let m;
      if ((m = l.match(/^\s*[-*•]\s+(.*)/))) { if (list !== 'ul') { flushList(); out += '<ul>'; list = 'ul'; } out += `<li>${inline(m[1])}</li>`; }
      else if ((m = l.match(/^\s*\d+[.)]\s+(.*)/))) { if (list !== 'ol') { flushList(); out += '<ol>'; list = 'ol'; } out += `<li>${inline(m[1])}</li>`; }
      else if ((m = l.match(/^#{1,4}\s+(.*)/))) { flushList(); out += `<h4>${inline(m[1])}</h4>`; }
      else if (!l.trim()) { flushList(); }
      else { flushList(); out += `<p>${inline(l)}</p>`; }
    }
    flushList(); flushTable();
    return out;
  }

  /* ---------- UI ---------- */
  function add(role, html) {
    const d = document.createElement('div'); d.className = 'msg ' + role; d.innerHTML = html;
    $('log').appendChild(d); d.scrollIntoView({ block: 'end', behavior: 'smooth' });
    return d;
  }
  function setBusy(b) { busy = b; $('send').disabled = b; $('q').disabled = false; }

  async function ask(text) {
    text = text.trim(); if (!text || busy) return;
    if (typeof puter === 'undefined') { add('err', 'The assistant could not load. Check your connection and refresh the page.'); return; }
    $('starters').hidden = true;
    add('user', esc(text).replace(/\n/g, '<br>'));
    history.push({ role: 'user', content: text });
    $('q').value = ''; autosize();
    setBusy(true);
    const bot = add('bot', '<span class="typing">Thinking…</span>');
    let acc = '';
    try {
      const msgs = [{ role: 'system', content: SYSTEM() }, ...history.slice(-12)];
      const resp = await puter.ai.chat(msgs, { model: $('model').value, stream: true, temperature: 0.2 });
      for await (const part of resp) {
        if (part && part.text) { acc += part.text; bot.innerHTML = md(acc); }
      }
      if (!acc) throw new Error('empty');
      history.push({ role: 'assistant', content: acc });
      bot.insertAdjacentHTML('beforeend', '<p class="hint" style="margin-top:8px">General information, not advice for your case. Check with a CA before acting on large amounts.</p>');
    } catch (e) {
      bot.remove();
      const msg = String(e && (e.message || e.error || e)).toLowerCase();
      add('err', msg.includes('auth') || msg.includes('cancel') || msg.includes('popup')
        ? 'Sign in to Puter when asked to use the assistant. It\'s free, and it lets MunVari answer without a server.'
        : 'Something went wrong getting an answer. Try again, or switch to the other model.');
      history.pop();
    }
    setBusy(false); $('q').focus();
  }

  function autosize() { const t = $('q'); t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 180) + 'px'; }

  document.addEventListener('DOMContentLoaded', () => {
    if (document.documentElement.classList.contains('is-app')) {
      $('composer').innerHTML = `<div class="callout">Ask needs a sign-in window that the app can't open. <a href="https://babubl.github.io/munvari/ask.html" target="_blank" rel="noopener">Open Ask in your browser</a>.</div>`;
    }
    $('starters').addEventListener('click', e => { const b = e.target.closest('button'); if (b) ask(b.textContent); });
    $('form').addEventListener('submit', e => { e.preventDefault(); ask($('q').value); });
    $('q').addEventListener('input', autosize);
    $('q').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask($('q').value); } });
    $('clear').addEventListener('click', () => { history.length = 0; $('log').innerHTML = ''; $('starters').hidden = false; $('q').focus(); });
    const q = new URLSearchParams(location.search).get('q');
    if (q && $('q')) { $('q').value = q; autosize(); $('q').focus(); }
  });
})();
