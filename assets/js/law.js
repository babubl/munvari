/* MunVari — law library: search and browse chapters, key sections, schedules and forms. */
(function(){
  const L=window.LAW, $=id=>document.getElementById(id);
  const CATS=[['all','All'],['basics','Basics'],['salary','Salary'],['property','House property'],['business','Business'],['gains','Capital gains'],['other','Other sources'],['losses','Losses'],['deductions','Deductions'],['rates','Rates & rebate'],['filing','Filing'],['tds','TDS & advance tax'],['interest','Interest & fees'],['refund','Refunds'],['clubbing','Clubbing']];
  let tab='sections', cat='all';
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const norm=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,' ');
  const chapterOf=n=>{n=parseInt(n,10);return L.chapters.find(c=>n>=c.from&&n<=c.to);};
  const askLink=q=>`<a class="ask" href="ask.html?q=${encodeURIComponent(q)}">Ask about this</a>`;

  function sectionRow(x){
    const ch=chapterOf(x.s);
    return `<article class="entry" id="s-${x.s}"><div class="no">Sec ${esc(x.s)}<small>old ${esc(x.o)}</small></div>
      <div><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p>
      <div class="meta">${ch?`Chapter ${ch.n} · ${esc(ch.title)}`:''}</div>${askLink(`Explain Section ${x.s} (old ${x.o}), ${x.t}, with an example.`)}</div></article>`;
  }
  function chapterRow(c){
    const keys=L.sections.filter(x=>{const n=parseInt(x.s,10);return n>=c.from&&n<=c.to;});
    return `<article class="entry" id="ch-${c.n}"><div class="no">Ch ${c.n}<small>Sec ${c.from}–${c.to}</small></div>
      <div><h3>${esc(c.title)}</h3><p>${esc(c.about)}</p>
      ${keys.length?`<div class="meta">Key sections: ${keys.map(k=>`<a class="law-chip" href="#s-${k.s}" onclick="LIB.go('sections','${k.s}')">${k.s} · ${esc(k.t)}</a>`).join('')}</div>`:''}</div></article>`;
  }
  function scheduleRow(s){
    return `<article class="entry" id="sch-${s.n}"><div class="no">Sch ${s.n}<small>${s.sec!=='—'?'Sec '+s.sec:''}</small></div>
      <div><h3>${esc(s.title)}</h3><p>${esc(s.about)}</p>${askLink(`What is in Schedule ${s.n} (${s.title}) of the Income-tax Act, 2025?`)}</div></article>`;
  }
  function formRow(f){
    return `<article class="entry"><div class="no">${esc(f.f)}<small>old ${esc(f.o)}</small></div>
      <div><h3>${esc(f.t)}</h3><p>${esc(f.d)}</p>${askLink(`What is ${f.f} (old ${f.o}) used for and who needs it?`)}</div></article>`;
  }

  function render(){
    const q=norm($('libq').value).trim();
    const match=o=>!q||q.split(' ').every(w=>norm(Object.values(o).join(' ')).includes(w));
    let html='';
    $('filters').hidden=tab!=='sections';
    if(tab==='sections'){
      const list=L.sections.filter(x=>(cat==='all'||x.cat===cat)&&match(x));
      html=list.map(sectionRow).join('');
    } else if(tab==='chapters') html=L.chapters.filter(match).map(chapterRow).join('');
    else if(tab==='schedules') html=L.schedules.filter(match).map(scheduleRow).join('');
    else html=L.forms.filter(match).map(formRow).join('');
    $('entries').innerHTML=html||`<p class="empty">No match. Try an old number like 80C or 234B, or a word like "rent".</p>`;
    $('count').textContent=($('entries').querySelectorAll('.entry').length)+' shown';
  }
  function setTab(t){
    tab=t; document.querySelectorAll('.tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===t));
    render();
  }
  window.LIB={go(t,id){ if(tab!==t)setTab(t); setTimeout(()=>{const el=document.getElementById((t==='sections'?'s-':'')+id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});},30);}};

  document.addEventListener('DOMContentLoaded',()=>{
    $('filters').innerHTML=CATS.map(([k,v])=>`<button type="button" data-cat="${k}" aria-pressed="${k==='all'}">${v}</button>`).join('');
    $('filters').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;cat=b.dataset.cat;$('filters').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));render();});
    document.querySelector('.tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(b)setTab(b.dataset.tab);});
    $('libq').addEventListener('input',render);
    const h=location.hash;
    if(h.startsWith('#ch-'))tab='chapters'; else if(h.startsWith('#sch-'))tab='schedules';
    setTab(tab);
    if(h){const el=document.querySelector(h);if(el)setTimeout(()=>el.scrollIntoView({block:'start'}),50);}
  });
})();
