/* MunVari — UI. Depends on rules-fy2026-27.js, engine.js and i18n.js (loaded first). */
const IS_APP=!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform());
if(IS_APP)document.documentElement.classList.add('is-app');
/* Public address of the site: taken from the canonical link so the app and the web share one URL. */
const SITE_URL=(document.querySelector('link[rel=canonical]')||{}).href||(location.origin+location.pathname).replace(/index\.html$/,'');
const SITE_SHORT=SITE_URL.replace(/^https?:\/\//,'').replace(/\/$/,'');
/* ================= helpers ================= */
let LANG='en';
const $=id=>document.getElementById(id);
const num=id=>{const el=$(id);return el?Math.max(0,Number(el.value)||0):0;};
const fmt=n=>(n<0?'−':'')+'₹'+Math.round(Math.abs(n)).toLocaleString('en-IN');
const T=k=>(I18N[LANG][k]!==undefined?I18N[LANG][k]:I18N.en[k]);
const tpl=(s,o)=>s.replace(/\{(\w+)\}/g,(_,k)=>o[k]!==undefined?o[k]:'');
const words=n=>{n=Number(n)||0;if(n>=1e7)return '₹'+(n/1e7).toFixed(n%1e7?2:0)+' Cr';if(n>=1e5)return '₹'+(n/1e5).toFixed(n%1e5?2:0).replace(/\.?0+$/,'')+' L';if(n>=1e3)return '₹'+(n/1e3).toFixed(1).replace(/\.0$/,'')+'K';return n?'₹'+n:'';};
function NOW(){const p=new URLSearchParams(location.search).get('today');if(p){const d=new Date(p+'T12:00:00');if(!isNaN(d))return d;}return new Date();}

function calc(inp,today){ return calcPlan(inp||readInputs(), today||NOW()); }

function readInputs(){
  const v=id=>$(id).value;
  return {
    regime:v('regime'), age:v('age'), resident:v('resident'), payMonth:Number(v('payMonth')),
    salary:num('salary'), empNps:num('empNps'), tdsSalary:num('tdsSalary'),
    fdInt:num('fdInt'), savInt:num('savInt'), tdsInt:num('tdsInt'),
    rent:num('rent'), muniTax:num('muniTax'), rentLoanInt:num('rentLoanInt'), tdsRent:num('tdsRent'),
    stcgEq:num('stcgEq'), stcgEqQ:v('stcgEqQ'), ltcgEq:num('ltcgEq'), ltcgEqQ:v('ltcgEqQ'),
    stcgOt:num('stcgOt'), stcgOtQ:v('stcgOtQ'), ltcgOt:num('ltcgOt'), ltcgOtQ:v('ltcgOtQ'),
    div:num('divAmt'), divQ:v('divQ'), tdsDiv:num('tdsDiv'),
    bizType:v('bizType'), bizReceipts:num('bizReceipts'), bizPct:Math.max(0,Math.min(100,Number(v('bizPct'))||0)), bizProfit:num('bizProfit'), tdsBiz:num('tdsBiz'),
    otherInc:num('otherInc'), tcs:num('tcs'),
    d80c:num('d80c'), d80ccd1b:num('d80ccd1b'), d80d:num('d80d'), dHra:num('dHra'), dSelfOcc:num('dSelfOcc'), dOther:num('dOther'),
    paid:[num('paid1'),num('paid2'),num('paid3'),num('paid4')]
  };
}

/* ================= render ================= */
function statusOf(r,i){
  if(r.presumptive&&i<3) return 'skip';
  if(r.passed[i]&&r.req[i]===0) return 'none';
  if(r.passed[i]) return r.cumPaid[i]>=r.req[i]-1||(r.c234[i]===0)?'paid':'short';
  return i===r.nextIdx?'due':'up';
}
const daysTo=(d,t)=>Math.max(0,Math.ceil((new Date(d.getFullYear(),d.getMonth(),d.getDate())-new Date(t.getFullYear(),t.getMonth(),t.getDate()))/864e5));

function renderCountdown(){
  const t=NOW(), idx=DUE.findIndex(d=>t<=d), el=$('countdown');
  if(idx===-1){el.innerHTML=`<div class="cd-txt"><b>${T('cd_over')}</b><span>${T('cd_over_sub')}</span></div>`;return;}
  const n=daysTo(DUE[idx],t);
  el.innerHTML=`<div class="cd-days">${n===0?'0':n}<small>${n===0?T('cd_today'):T('cd_days')}</small></div>
  <div class="cd-txt"><b>${T('cd_next')}: ${DUE_LBL[idx]}</b><span>${PCT[idx]*100}% ${T('cd_cum')}</span></div>`;
}

function render(){
  const r=calc();
  saveState();
  // section summaries
  const s=(id,v)=>{$(id).textContent=v?words(v):'';};
  s('sum-salary',r.inp.salary); s('sum-interest',r.inp.fdInt+r.inp.savInt); s('sum-rent',r.inp.rent);
  s('sum-cg',r.inp.stcgEq+r.inp.ltcgEq+r.inp.stcgOt+r.inp.ltcgOt); s('sum-div',r.inp.div);
  s('sum-biz',r.inp.bizType==='reg'?r.inp.bizProfit:(r.inp.bizType==='none'?0:r.inp.bizReceipts));
  s('sum-other',r.inp.otherInc+r.inp.tcs); s('sum-paid',r.paidTotal);
  const dedT=r.inp.d80c+r.inp.d80ccd1b+r.inp.d80d+r.inp.dHra+r.inp.dSelfOcc+r.inp.dOther; s('sum-ded',dedT);
  renderVerdict(r); renderAlerts(r); renderRail(r); renderDrivers(r); renderRegime(r); renderInterest(r); renderWaterfall(r); buildCard(r);
}

function renderVerdict(r){
  const v=$('verdict'); const any=r.full.totalIncome>0;
  const riskTot=r.c234tot+r.c234ftot+r.b234;
  const paidPct=r.netFull>0?Math.round(Math.min(1,r.paidTotal/r.netFull)*100):0;
  let mb='';
  if(!any){ v.className='verdict na';
    v.innerHTML=`<div class="v-label">${T('v_waiting')}</div><div class="v-amt">—</div><div class="v-sub">${T('v_waiting_sub')}</div>`;
  } else if(!r.applicable){ v.className='verdict ok';
    v.innerHTML=`<div class="v-label">${T('v_na')}</div><div class="v-amt">₹0</div><div class="v-sub">${r.seniorExempt?T('v_na_sub_senior'):T('v_na_sub_10k')}</div>`;
    mb=`${T('v_na')}`;
  } else if(r.nextIdx===-1){
    const bal=Math.max(0,r.netFull-r.paidTotal);
    v.className=bal>0?'verdict pay':'verdict ok';
    v.innerHTML=`<div class="v-label">${T('v_over')}</div><div class="v-amt">${bal>0?fmt(bal):'✓'}</div><div class="v-sub">${bal>0?T('v_over_sub'):T('v_done_sub')}</div>${metaTags(r,paidPct,riskTot)}`;
    mb=bal>0?`<span>${T('v_over')}</span> <b>${fmt(bal)}</b>`:T('v_done');
  } else if(r.owe<=0){
    const i=r.nextIdx; v.className='verdict ok';
    v.innerHTML=`<div class="v-label">${T('v_done')}</div><div class="v-amt">✓</div><div class="v-sub">${T('v_next_ok')}: ${DUE_LBL[i]} · ${fmt(r.req[i])} ${T('v_cum')}</div>${metaTags(r,paidPct,riskTot)}`;
    mb=T('v_done');
  } else {
    const i=r.nextIdx, n=daysTo(DUE[i],r.today);
    v.className='verdict pay';
    v.innerHTML=`<div class="v-label">${T('v_pay')} ${DUE_LBL[i]} · ${n===0?T('v_today'):n+' '+T('v_days')}</div>
      <div class="v-amt">${fmt(r.owe)}</div>
      <div class="v-sub">${r.presumptive?T('plan_presump'):`${PCT[i]*100}% ${T('v_cum')}: ${fmt(r.req[i])} − ${fmt(r.paidTotal)} ${T('st_paid').toLowerCase()}`}</div>
      ${metaTags(r,paidPct,riskTot)}
      <div class="v-actions"><button class="btn sm" onclick="downloadIcs()">${T('b_remind')}</button><a class="btn ghost sm" href="https://www.incometax.gov.in/iec/foportal/" target="_blank" rel="noopener">${T('b_portal')} ↗</a></div>
      <details class="howpay"><summary>${T('b_howpay')}</summary><ol><li>${T('hp1')}</li><li>${T('hp2')}</li><li>${T('hp3')}</li><li>${T('hp4')}</li></ol></details>`;
    mb=`<span>${T('v_pay')} ${DUE_SHORT[i]}</span> <b>${fmt(r.owe)}</b>`;
  }
  $('mbarTxt').innerHTML=mb; MBAR_READY=!!mb; updMbar();
}
function metaTags(r,paidPct,riskTot){
  return `<div class="v-meta"><span class="tagc ${paidPct>=100?'good':''}">${paidPct}% ${T('v_paidpct')}</span>${riskTot>0?`<span class="tagc bad">${fmt(riskTot)} ${T('v_risk')}</span>`:`<span class="tagc good">${T('v_norisk')}</span>`}</div>`;
}

function renderAlerts(r){
  const a=[]; const i=r.inp;
  if(i.bizType==='44ada'&&i.bizReceipts>7500000) a.push(['warn',T('al_44ada')]);
  if(i.bizType==='44ad'&&i.bizReceipts>30000000) a.push(['warn',T('al_44ad')]);
  if(r.full.total>0&&r.credit>r.full.total+100) a.push(['info',T('al_tdsmore')]);
  if(i.ltcgEq>0&&i.ltcgEq<=125000) a.push(['info',T('al_ltcgfree')]);
  if(i.resident==='nr'&&(i.stcgEq+i.ltcgEq+i.ltcgOt)>0) a.push(['info',T('al_nr')]);
  const others=i.fdInt+i.savInt+i.rent+i.div+i.otherInc+i.stcgEq+i.ltcgEq+i.stcgOt+i.ltcgOt+(i.bizType==='none'?0:1);
  if(i.salary>0&&!others&&!r.applicable) a.push(['info',T('al_salonly')]);
  $('alerts').innerHTML=a.map(([c,t])=>`<div class="alert ${c}"><span class="ai" aria-hidden="true">${c==='warn'?'!':'i'}</span><span>${t}</span></div>`).join('');
}

/* stops sit evenly at 12.5/37.5/62.5/87.5%; 'today' is placed piecewise between them */
const STOP_X=[12.5,37.5,62.5,87.5];
function railPos(d){const pts=[[FY_START,0],[DUE[0],12.5],[DUE[1],37.5],[DUE[2],62.5],[DUE[3],87.5],[FY_END,100]];
  for(let k=1;k<pts.length;k++){if(d<=pts[k][0]){const[a,x0]=pts[k-1],[b,x1]=pts[k];return x0+(x1-x0)*Math.max(0,(d-a)/(b-a));}}return 100;}
function renderRail(r){
  const stLbl={none:T('st_none'),paid:T('st_paid'),short:T('st_short'),due:T('st_due'),up:T('st_up'),skip:''};
  const paidFrac=r.netFull>0?Math.min(1,r.paidTotal/r.netFull):0;
  const fx=[[0,0],[.15,12.5],[.45,37.5],[.75,62.5],[1,87.5]]; let fillX=0;
  for(let k=1;k<fx.length;k++){if(paidFrac<=fx[k][0]){const[a0,x0]=fx[k-1],[a1,x1]=fx[k];fillX=x0+(x1-x0)*(paidFrac-a0)/(a1-a0);break;}}
  if(r.presumptive) fillX=paidFrac*87.5;
  let h=`<div class="rail-track"><div class="rail-fill" style="width:${fillX.toFixed(1)}%"></div>`;
  if(r.today>=FY_START&&r.today<=FY_END) h+=`<div class="rail-today" style="left:${railPos(r.today)}%"><span>${T('today')}</span></div>`;
  h+=`</div>`;
  for(let i=0;i<4;i++){
    const st=r.applicable?statusOf(r,i):'up';
    const pos=STOP_X[i];
    const pct=r.presumptive?(i===3?'100%':'—'):(PCT[i]*100+'%');
    h+=`<div class="stop ${st}" style="left:${pos}%"><div class="dot">${st==='paid'?'✓':st==='none'?'–':i+1}</div>
      <div class="s-date">${DUE_SHORT[i]}</div><div class="s-pct">${pct}</div>
      <div class="s-amt">${r.applicable&&r.req[i]?fmt(r.req[i]):'—'}</div>
      <div class="s-state">${r.applicable?stLbl[st]:''}</div></div>`;
  }
  $('rail').innerHTML=h;
  // plan
  let p='';
  if(r.applicable){
    if(r.presumptive) p+=`<p class="hint" style="margin-bottom:6px">${T('plan_presump')}</p>`;
    const rows=r.plan.filter(x=>x.add>0);
    if(rows.length){ p+=`<h4>${T('plan_h')}</h4>`+rows.map(x=>`<div class="plan-row"><span>${T('plan_by')} ${DUE_LBL[x.i]}</span><b>${fmt(x.add)} ${T('plan_more')}</b></div>`).join('');
      if(r.saveNext>0) p+=`<div class="saver">${tpl(T('saver'),{amt:fmt(r.owe),date:DUE_LBL[r.nextIdx],sav:fmt(r.saveNext)})}</div>`;
    } else if(r.nextIdx!==-1) p+=`<p class="hint">${T('plan_none')}</p>`;
  }
  $('plan').innerHTML=p; $('plan').style.display=p?'block':'none';
}

const DRV_COL={sal:'#171A20',int:'#3E6AE1',rent:'#8E98A8',biz:'#5C5E62',div:'#A9BCF0',oth:'#D0D1D2',cg:'#1F3F99'};
function renderDrivers(r){
  const d=drivers(r.inp).filter(x=>x.v>0);
  const tot=d.reduce((a,x)=>a+x.v,0);
  if(!tot){$('drivers').innerHTML=`<p class="hint">${T('drv_none')}</p>`;return;}
  let h=`<div class="stack" role="img" aria-label="Tax by income source">`+d.map(x=>`<div style="width:${(x.v/tot*100).toFixed(2)}%;background:${DRV_COL[x.k]}" title="${T('src_'+x.k)}"></div>`).join('')+`</div>`;
  h+=d.map(x=>`<div class="drv"><i style="background:${DRV_COL[x.k]}"></i><span>${T('src_'+x.k)}<small>${Math.round(x.v/tot*100)}%</small></span><b>${fmt(x.v)}</b></div>`).join('');
  if(r.credit>0) h+=`<div class="drv"><i style="background:var(--leaf)"></i><span>${T('drv_tds')}</span><b class="neg">− ${fmt(Math.min(r.credit,tot))}</b></div>`;
  const gap=Math.max(0,tot-r.credit);
  if(r.credit>0){
    if(gap<=0) h+=`<div class="insight">${T('drv_ins_full')}</div>`;
    else{
      const nonSal=d.filter(x=>x.k!=='sal').sort((a,b)=>b.v-a.v);
      const src=(nonSal[0]||d[0]);
      h+=`<div class="insight">${tpl(T('drv_ins_cover'),{cov:fmt(Math.min(r.credit,tot)),tot:fmt(tot),gap:fmt(gap),src:T('src_'+src.k).toLowerCase()})}</div>`;
    }
  }
  h+=`<p class="hint" style="margin-top:8px">${T('drv_layer')}</p>`;
  $('drivers').innerHTML=h;
}

function renderRegime(r){
  const i=r.inp;
  if(r.full.totalIncome<=0){$('regimeBox').innerHTML=`<p class="hint">${T('drv_none')}</p>`;return;}
  const tn=computeTax({...i,regime:'new'},4).total, to=computeTax({...i,regime:'old'},4).total;
  const nn=Math.max(0,tn-r.credit), no=Math.max(0,to-r.credit);
  const win=tn===to?'':(tn<to?'new':'old');
  const box=(k,t,n)=>`<div class="rbox ${win===k?'win':''}">${win===k?`<span class="badge">${T('rg_better')}</span>`:''}<div class="rn">${T('rg_'+k)}${i.regime===k?' · '+T('rg_current'):''}</div><div class="rv">${fmt(t)}</div><div class="rs">${T('wf_net')}: ${fmt(n)}</div></div>`;
  let h=`<div class="regime">${box('new',tn,nn)}${box('old',to,no)}</div>`;
  h+=`<p class="rnote">${win?tpl(T('rg_save'),{r:T('rg_'+win),amt:fmt(Math.abs(tn-to))}):T('rg_same')}</p>`;
  const deds=i.d80c+i.d80ccd1b+i.d80d+i.dHra+i.dSelfOcc+i.dOther;
  if(!deds) h+=`<p class="rnote">${T('rg_nodeds')}</p>`;
  $('regimeBox').innerHTML=h;
}

function renderInterest(r){
  let ib='';
  if(!r.applicable||(r.c234tot+r.c234ftot+r.b234)===0) ib=`<div class="int-row"><span class="chip-ok">${T('int_none')}</span></div>`;
  else{
    for(let i=0;i<4;i++){
      if(!r.passed[i]||(r.presumptive&&i<3))continue;
      const sh=(!r.presumptive&&i<2&&r.req[i]>r.cumPaid[i]&&r.c234[i]===0)?(' ✓ '+T('int_sh')):' ✓';
      ib+=`<div class="int-row"><span>234C · ${DUE_LBL[i]}</span><b class="${r.c234[i]>0?'chip-bad':'chip-ok'}">${r.c234[i]>0?fmt(r.c234[i]):sh}</b></div>`;
    }
    if(r.c234ftot>0) ib+=`<div class="int-row proj"><span>${T('int_proj')}</span><b class="chip-bad">${fmt(r.c234ftot)}</b></div>`;
    if(r.b234>0) ib+=`<div class="int-row proj"><span>${T('int_234b')} ${['','','','','Apr','May','Jun','Jul','Aug','Sep'][r.inp.payMonth]} 2027 (${r.bMonths}×1%)</span><b class="chip-bad">${fmt(r.b234)}</b></div>`;
    ib+=`<div class="int-row" style="border-bottom:0"><span><b style="font-family:var(--body)">${T('int_total')}</b></span><b class="chip-bad">${fmt(r.c234tot+r.c234ftot+r.b234)}</b></div>`;
    ib+=`<div class="int-note">${T('int_paid_note')}</div>`;
  }
  $('intBox').innerHTML=ib;
}

function renderWaterfall(r){
  const f=r.full;
  let wf=`<tr class="sub"><td>${T('wf_ti')}</td><td>${fmt(f.totalIncome)}</td></tr>
  <tr class="sub"><td>${T('wf_gti')}</td><td>${fmt(f.normalTI)}</td></tr>
  <tr class="head"><td colspan="2">${T('wf_h_tax')}</td></tr>
  <tr><td>${T('wf_normal')}</td><td>${fmt(f.normalTax)}</td></tr>`;
  if(f.stcgTax>0)wf+=`<tr><td>${T('wf_stcg')}</td><td>${fmt(f.stcgTax)}</td></tr>`;
  if(f.ltcgTax>0)wf+=`<tr><td>${T('wf_ltcg')}</td><td>${fmt(f.ltcgTax)}</td></tr>`;
  if(f.rebate>0)wf+=`<tr><td>${T('wf_rebate')} <button class="why" onclick="openFaq('q-rebate')" aria-label="Explain">?</button></td><td class="neg">− ${fmt(f.rebate)}</td></tr>`;
  if(f.surcharge>0)wf+=`<tr><td>${T('wf_sur')} <button class="why" onclick="openFaq('q-surcharge')" aria-label="Explain">?</button></td><td>${fmt(f.surcharge)}</td></tr>`;
  wf+=`<tr><td>${T('wf_cess')}</td><td>${fmt(f.cess)}</td></tr>
  <tr><td><b>${T('wf_total')}</b></td><td><b>${fmt(f.total)}</b></td></tr>`;
  if(r.tds>0)wf+=`<tr><td>${T('wf_tds')}</td><td class="neg">− ${fmt(r.tds)}</td></tr>`;
  if(r.inp.tcs>0)wf+=`<tr><td>${T('wf_tcs')}</td><td class="neg">− ${fmt(r.inp.tcs)}</td></tr>`;
  wf+=`<tr class="tot"><td>${T('wf_net')}</td><td>${fmt(r.netFull)}</td></tr>`;
  $('wfTable').innerHTML=wf;
}

/* ================= share / calendar ================= */
function buildCard(r){
  r=r||calc();
  const sq=[0,1,2,3].map(i=>{ if(!r.applicable)return '⬜'; const st=statusOf(r,i); return st==='paid'?'🟩':st==='short'?'🟥':st==='due'?'🟨':'⬜'; }).join('');
  let lines=[`MunVari · Advance Tax FY 2026-27`,`${sq}  ${r.applicable?Math.round(Math.min(1,r.paidTotal/Math.max(1,r.netFull))*100)+'% paid':'Not applicable ✅'}`];
  if(r.applicable&&r.nextIdx!==-1&&r.owe>0) lines.push(`Next: ${fmt(r.owe)} by ${DUE_LBL[r.nextIdx]}`);
  const risk=r.c234tot+r.c234ftot+r.b234; if(r.applicable&&risk>0) lines.push(`Interest at risk: ${fmt(risk)}`);
  lines.push(`Check yours in 60 seconds: ${SITE_SHORT}`);
  $('shareCard').textContent=lines.join('\n');
}
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('on');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('on'),1800);}
function copyCard(){
  const txt=$('shareCard').textContent;
  const done=()=>toast(T('copied'));
  if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done,()=>fallbackCopy(txt,done));
  else fallbackCopy(txt,done);
}
function fallbackCopy(txt,cb){const ta=document.createElement('textarea');ta.value=txt;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');cb();}catch(e){}ta.remove();}
/* In the Android app, file downloads don't reach the calendar, so open Google Calendar with the next installment instead. */
function appReminder(r){
  const pad=n=>String(n).padStart(2,'0'), ymd=d=>d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate());
  const i=r.passed.indexOf(false); if(i<0){toast(T('cd_over'));return;}
  const p=r.plan.find(x=>x.i===i), amt=r.applicable&&p?p.add:0, d=DUE[i], d2=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1);
  const text=amt>0?`Advance tax: pay ${fmt(amt).replace('₹','Rs ')} (${PCT[i]*100}% cumulative)`:`Advance tax due date (${PCT[i]*100}% cumulative)`;
  const url='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(text)+'&dates='+ymd(d)+'/'+ymd(d2)+'&details='+encodeURIComponent('Pay at incometax.gov.in > e-Pay Tax > Advance Tax (100). Check your estimate: '+SITE_URL);
  window.open(url,'_blank');
}
function downloadIcs(){
  const r=calc();
  if(IS_APP){appReminder(r);return;} const pad=n=>String(n).padStart(2,'0');
  const ymd=d=>d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate());
  const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'');
  const esc=s=>s.replace(/[,;\\]/g,m=>'\\'+m);
  let ev='';
  for(let i=0;i<4;i++){
    if(r.passed[i])continue;
    const p=r.plan.find(x=>x.i===i);
    const amt=r.applicable&&p?p.add:0;
    const d=DUE[i], d2=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1);
    const sum=amt>0?`Advance tax: pay ${fmt(amt).replace('₹','Rs ')} (${PCT[i]*100}% cumulative)`:`Advance tax due date (${PCT[i]*100}% cumulative)`;
    ev+=`BEGIN:VEVENT\r\nUID:munvari-fy2627-q${i+1}@munvari\r\nDTSTAMP:${stamp}\r\nDTSTART;VALUE=DATE:${ymd(d)}\r\nDTEND;VALUE=DATE:${ymd(d2)}\r\nSUMMARY:${esc(sum)}\r\nDESCRIPTION:${esc('incometax.gov.in > e-Pay Tax > Income Tax > AY 2027-28 > Advance Tax (100). Re-check your estimate: '+SITE_URL)}\r\nBEGIN:VALARM\r\nTRIGGER:-P3D\r\nACTION:DISPLAY\r\nDESCRIPTION:${esc(sum)}\r\nEND:VALARM\r\nEND:VEVENT\r\n`;
  }
  if(!ev){toast(T('cd_over'));return;}
  const ics=`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//MunVari//Advance Tax//EN\r\nCALSCALE:GREGORIAN\r\n${ev}END:VCALENDAR\r\n`;
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'})); a.download='munvari-advance-tax-2026-27.ics';
  document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500); toast(T('ics_ok'));
}

/* ================= FAQ + language ================= */
function buildFaq(){
  $('faqList').innerHTML=FAQ.map(q=>{const[qq,aa]=q.en;return `<details class="qa" id="${q.id}"><summary>${qq}</summary><div class="a">${aa}</div></details>`;}).join('');
  $('faqSub').textContent=tpl(T('faq_sub'),{n:FAQ.length});
  let ld=document.getElementById('faqld'); if(!ld){ld=document.createElement('script');ld.type='application/ld+json';ld.id='faqld';document.head.appendChild(ld);}
  ld.textContent=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":FAQ.map(q=>({"@type":"Question","name":q.en[0],"acceptedAnswer":{"@type":"Answer","text":q.en[1]}}))});
}
function openFaq(id){const el=$(id);if(!el)return;el.open=true;el.scrollIntoView({behavior:'smooth',block:'center'});}
function setLang(l){
  LANG='en'; document.documentElement.lang='en-IN';
  document.querySelectorAll('[data-i]').forEach(el=>{const v=I18N[l][el.getAttribute('data-i')];if(v!==undefined)el.textContent=v;});
  fillQuarterSelects(); buildFaq(); syncDed(); renderCountdown(); wizUi(); if(WSTEP===3)buildPaidFields(); render();
}
function fillQuarterSelects(){
  document.querySelectorAll('.qsel').forEach(s=>{
    const cur=s.value||'even';
    s.innerHTML=`<option value="even">${T('q_even')}</option><option value="1">${T('q1')}</option><option value="2">${T('q2')}</option><option value="3">${T('q3')}</option><option value="4">${T('q4')}</option>`;
    s.value=cur;
  });
}
function syncBiz(setPct){
  const t=$('bizType').value;
  $('bizFields').style.display=t==='none'?'none':'grid';
  $('f-receipts').style.display=t==='reg'?'none':'flex';
  $('f-deemed').style.display=t==='reg'?'none':'flex';
  $('f-profit').style.display=t==='reg'?'flex':'none';
  if(setPct){ if(t==='44ada')$('bizPct').value=50; if(t==='44ad')$('bizPct').value=8; }
}
function syncDed(){ $('dedHint').textContent=$('regime').value==='old'?T('h_dedold'):T('h_dednew'); }

/* lakh / crore helper under money inputs */
function initMoney(){
  document.querySelectorAll('input.money').forEach(inp=>{
    if(inp._amt)return;
    const sp=document.createElement('span'); sp.className='amtw'; sp.setAttribute('aria-hidden','true');
    inp.closest('.inwrap').after(sp); inp._amt=sp; updAmt(inp);
  });
}
function updAmt(inp){ if(inp._amt){const n=Number(inp.value)||0; inp._amt.textContent=n>=1000?words(n):'';} }

function onEdit(e){
  const t=e.target; if(!t.matches||!t.matches('input,select'))return;
  if(t.classList.contains('money'))updAmt(t);
  if(t.closest('#wiz'))return;
  if(t.id==='bizType')syncBiz(true);
  if(t.id==='regime')syncDed();
  if(t.id==='remember'){ if(!t.checked){try{localStorage.removeItem('munvari.v2');}catch(e){}} }
  render();
}
document.addEventListener('input',onEdit);
document.addEventListener('change',onEdit);

/* ================= persistence (local only, opt-in) ================= */
const PERSIST=['regime','age','resident','payMonth','salary','empNps','tdsSalary','fdInt','savInt','tdsInt','rent','muniTax','rentLoanInt','tdsRent','stcgEq','stcgEqQ','ltcgEq','ltcgEqQ','stcgOt','stcgOtQ','ltcgOt','ltcgOtQ','divAmt','divQ','tdsDiv','bizType','bizReceipts','bizPct','bizProfit','tdsBiz','otherInc','tcs','d80c','d80ccd1b','d80d','dHra','dSelfOcc','dOther','paid1','paid2','paid3','paid4'];
function saveState(){
  if(!$('remember').checked)return;
  const o={}; PERSIST.forEach(id=>o[id]=$(id).value);
  try{localStorage.setItem('munvari.v2',JSON.stringify(o));}catch(e){}
}
function loadState(){
  let o=null; try{o=JSON.parse(localStorage.getItem('munvari.v2')||'null');}catch(e){}
  if(!o)return false;
  PERSIST.forEach(id=>{if(o[id]!==undefined)$(id).value=o[id];});
  $('remember').checked=true; syncBiz(false); syncDed(); return true;
}
function clearAll(){
  PERSIST.forEach(id=>{const el=$(id); if(el.tagName==='SELECT'){el.selectedIndex=0;} else el.value='';});
  $('payMonth').value='7'; $('bizPct').value='50'; fillQuarterSelects();
  document.querySelectorAll('#wiz input[type=number]').forEach(i=>i.value='');
  document.querySelectorAll('.chip').forEach(c=>{c.setAttribute('aria-pressed','false');$('box-'+c.dataset.chip).classList.remove('on');});
  try{localStorage.removeItem('munvari.v2');}catch(e){}
  syncBiz(false); syncDed(); document.querySelectorAll('input.money').forEach(updAmt); render(); toast(T('cleared'));
}

/* ================= theme ================= */
function toggleTheme(){
  const cur=document.documentElement.getAttribute('data-theme');
  const dark=cur?cur==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
  const nx=dark?'light':'dark'; document.documentElement.setAttribute('data-theme',nx);
  try{localStorage.setItem('munvari.theme',nx);}catch(e){}
}
try{const th=localStorage.getItem('munvari.theme');if(th)document.documentElement.setAttribute('data-theme',th);}catch(e){}

function toggleSize(){
  const on=document.documentElement.getAttribute('data-size')!=='lg';
  if(on)document.documentElement.setAttribute('data-size','lg'); else document.documentElement.removeAttribute('data-size');
  $('sizeBtn').setAttribute('aria-pressed',on);
  try{on?localStorage.setItem('munvari.size','lg'):localStorage.removeItem('munvari.size');}catch(e){}
}
if(document.documentElement.getAttribute('data-size')==='lg')$('sizeBtn').setAttribute('aria-pressed','true');

/* ================= wizard ================= */
let WSTEP=0; const WLAST=3;
function wizUi(){
  $('wizCount').textContent=`${T('w_step')} ${WSTEP+1} ${T('w_of')} 4`;
  $('wizBar').style.width=((WSTEP+1)/4*100)+'%';
  $('wBack').style.visibility=WSTEP===0?'hidden':'visible';
  $('wNext').textContent=WSTEP===WLAST?T('w_see'):T('w_next');
}
function wizGo(d){
  const steps=document.querySelectorAll('.wstep');
  if(WSTEP+d<0)return;
  if(WSTEP+d>WLAST){finishWizard(false);return;}
  steps[WSTEP].classList.remove('on'); WSTEP+=d; steps[WSTEP].classList.add('on');
  if(WSTEP===3)buildPaidFields();
  wizUi();
  const f=steps[WSTEP].querySelector('input:not([type=hidden]),select,button'); if(f&&d>0)f.focus({preventScroll:true});
}
document.querySelectorAll('.segpick').forEach(g=>g.addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b)return;
  g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));
  $(g.dataset.pick).value=b.dataset.v;
}));
document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{
  const on=c.getAttribute('aria-pressed')!=='true'; c.setAttribute('aria-pressed',on);
  const box=$('box-'+c.dataset.chip); box.classList.toggle('on',on);
  if(!on)box.querySelectorAll('input').forEach(i=>{i.value='';updAmt(i);});
  else{const f=box.querySelector('input,select'); if(f)f.focus();}
  const any=[...document.querySelectorAll('.chip')].some(x=>x.getAttribute('aria-pressed')==='true' && x.dataset.chip!=='ccg');
  $('w_otdsWrap').style.display=any?'flex':'none';
}));
$('wiz').addEventListener('keydown',e=>{ if(e.key==='Enter'&&e.target.matches('input')){e.preventDefault();wizGo(1);} });
function buildPaidFields(){
  const today=NOW(); const k=DUE.filter(d=>today>d).length; // installment dates passed
  const keep=[0,1,2,3].map(i=>{const el=$('w_paid'+i);return el?el.value:'';});
  const n=Math.min(4,k+1); let html='';
  for(let i=0;i<n;i++){
    let lbl;
    if(i===0) lbl=`${T('w_paid_by')} 15 Jun 2026`;
    else if(i<k) lbl=`${T('w_paid_btw')} 16 ${['Jun','Sep','Dec'][i-1]} – ${DUE_LBL[i]}`;
    else lbl=`${T('w_paid_since')} 16 ${['Jun','Sep','Dec'][i-1]} 2026`;
    html+=`<div class="f"><label for="w_paid${i}">${lbl}</label><div class="inwrap rupee"><input type="number" class="money" inputmode="numeric" id="w_paid${i}" min="0" placeholder="0" value="${keep[i]}"></div></div>`;
  }
  $('w_paidFields').innerHTML=html; initMoney();
}
function syncWizard(){
  const wv=id=>{const el=$(id);return el?el.value:'';};
  $('regime').value=wv('w_regime'); $('age').value=wv('w_age');
  $('salary').value=wv('w_salary'); $('tdsSalary').value=wv('w_tdsSalary');
  const on=k=>document.querySelector(`[data-chip=${k}]`).getAttribute('aria-pressed')==='true';
  $('fdInt').value=on('cint')?wv('w_int'):''; $('savInt').value='';
  if(on('ccg')){
    $('stcgEq').value=wv('w_stcg'); $('ltcgEq').value=wv('w_ltcg'); $('ltcgOt').value=wv('w_ltcgot');
    const q=wv('w_cgq'); ['stcgEqQ','ltcgEqQ','ltcgOtQ'].forEach(id=>$(id).value=q);
  } else {['stcgEq','ltcgEq','ltcgOt'].forEach(id=>$(id).value='');}
  $('rent').value=on('crent')?wv('w_rent'):'';
  if(on('cbiz')){ $('bizType').value=wv('w_biztype'); $('bizReceipts').value=wv('w_receipts'); syncBiz(true); }
  else { $('bizType').value='none'; syncBiz(false); }
  $('divAmt').value=on('cdiv')?wv('w_div'):'';
  $('tdsInt').value=wv('w_otds');
  for(let i=0;i<4;i++){$('paid'+(i+1)).value=wv('w_paid'+i);}
  syncDed();
}
function finishWizard(skip){
  if(!skip)syncWizard();
  $('wiz').hidden=true; $('app').hidden=false;
  if(!skip) document.querySelectorAll('details.sec').forEach(dd=>dd.open=false);
  document.querySelectorAll('input.money').forEach(updAmt);
  render();
  const target=window.matchMedia('(max-width:900px)').matches?$('results'):$('app');
  target.scrollIntoView({behavior:'smooth',block:'start'});
}
function reopenWizard(){ $('app').hidden=true; $('wiz').hidden=false; $('wiz').scrollIntoView({behavior:'smooth'}); }

/* mobile sticky bar: show when verdict is off-screen */
let MBAR_READY=false, VERDICT_VISIBLE=true;
function updMbar(){ $('mbar').classList.toggle('on',MBAR_READY&&!VERDICT_VISIBLE&&!$('app').hidden); }
if('IntersectionObserver' in window){ new IntersectionObserver(es=>{VERDICT_VISIBLE=es[0].isIntersecting;updMbar();}).observe($('verdict')); }

/* ================= init ================= */
fillQuarterSelects(); initMoney(); syncBiz(false); syncDed();
const hadState=loadState();
if(hadState) $('welcome').classList.add('on');
try{localStorage.removeItem('munvari.lang');}catch(e){}
setLang('en');

/* ================= installable app ================= */
if(!IS_APP && 'serviceWorker' in navigator && location.protocol==='https:'){
  window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
let INSTALL_EVT=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();INSTALL_EVT=e;const b=$('installBtn');if(b)b.hidden=false;});
function installApp(){ if(!INSTALL_EVT)return; INSTALL_EVT.prompt(); INSTALL_EVT.userChoice.finally(()=>{INSTALL_EVT=null;$('installBtn').hidden=true;}); }
window.addEventListener('appinstalled',()=>{const b=$('installBtn');if(b)b.hidden=true;});
