/* MunVari — tax engine. Pure functions, no DOM. Runs in the browser and in Node (tests).
 * Reads every rate and limit from RULES (rules-fy2026-27.js).
 */
(function (root) {
  const R = root.RULES || (typeof require !== 'undefined' ? require('./rules-fy2026-27.js') : null);
  const AT = R.advanceTax;
  const mkDate = ([y, m, d], end) => end ? new Date(y, m, d, 23, 59, 59) : new Date(y, m, d);

  const DUE = AT.due.map(d => mkDate(d, true));
  const DUE_LBL = AT.dueLabel;
  const DUE_SHORT = AT.dueShort;
  const PCT = AT.cumulative;
  const FY_START = mkDate(AT.fyStart), FY_END = mkDate(AT.fyEnd, true);

  function exLimit(regime, age) {
    return regime === 'new' ? R.exemption.new : R.exemption.old[age] || R.exemption.old.lt60;
  }

  function slabTax(x, regime, age) {
    const s = R.slabs[regime].map(([cap, r]) => [cap === null ? exLimit(regime, age) : cap, r]);
    let t = 0, prev = 0;
    for (const [cap, r] of s) { if (x > prev) t += (Math.min(x, cap) - prev) * r; prev = cap; if (x <= cap) break; }
    return Math.max(0, t);
  }

  /* Tax on already-computed income parts (after deductions and loss set-off), before surcharge.
     Used for the real computation and again at each surcharge threshold for exact marginal relief. */
  function baseTax(p) {
    const CG = R.capitalGains;
    if (p.firm) {
      const t = p.normalTI * R.firm.rate + p.stEq * CG.stcg111A
        + (Math.max(0, p.ltEq - CG.ltcg112AExempt) + p.ltOt) * CG.ltcg;
      return { normalTax: p.normalTI * R.firm.rate, rebate: 0, stcgTax: p.stEq * CG.stcg111A,
        ltcgTax: (Math.max(0, p.ltEq - CG.ltcg112AExempt) + p.ltOt) * CG.ltcg, normalAfter: p.normalTI * R.firm.rate,
        stcgAfter: p.stEq * CG.stcg111A, taxAR: t };
    }
    const isNew = p.regime === 'new';
    const totalIncome = p.normalTI + p.stEq + p.ltEq + p.ltOt;
    const normalTax = slabTax(p.normalTI, p.regime, p.age);
    // Unused basic exemption absorbs special-rate gains (residents), highest rate first
    let spill = p.res ? Math.max(0, exLimit(p.regime, p.age) - p.normalTI) : 0;
    const stcgTaxable = Math.max(0, p.stEq - spill); spill = Math.max(0, spill - p.stEq);
    const ltRaw = Math.max(0, p.ltEq - CG.ltcg112AExempt) + p.ltOt;
    const ltTaxable = Math.max(0, ltRaw - spill);
    const stcgTax = stcgTaxable * CG.stcg111A, ltcgTax = ltTaxable * CG.ltcg;
    // Rebate (s.156, old 87A): resident individuals only; never against 112A; new regime not against 111A
    let rebate = 0;
    if (p.res && p.ind) {
      if (isNew) {
        const rb = R.rebate87A.new;
        if (totalIncome <= rb.limit) rebate = Math.min(normalTax, rb.max);
        else { const due = normalTax + stcgTax + ltcgTax, excess = totalIncome - rb.limit; if (due > excess) rebate = Math.min(normalTax, due - excess); }
      } else if (totalIncome <= R.rebate87A.old.limit) rebate = Math.min(normalTax + stcgTax, R.rebate87A.old.max);
    }
    const rebN = Math.min(rebate, normalTax), rebS = rebate - rebN;
    const normalAfter = normalTax - rebN, stcgAfter = stcgTax - rebS;
    return { normalTax, rebate, stcgTax, ltcgTax, normalAfter, stcgAfter, taxAR: normalAfter + stcgAfter + ltcgTax };
  }

  /* Surcharge at a given rate; for individuals/HUFs the rate on capital gains and dividends is capped at 15%. */
  function surchargeAt(p, b, rate) {
    if (!rate) return 0;
    if (p.firm) return b.taxAR * rate;
    const divTax = p.normalTI > 0 ? b.normalAfter * Math.min(1, p.div / p.normalTI) : 0;
    const capped = b.stcgAfter + b.ltcgTax + divTax, uncapped = b.taxAR - capped;
    return uncapped * rate + capped * Math.min(rate, R.surchargeCapOnGains);
  }

  /* Income parts reduced to a threshold: the excess comes off slab income first, then 111A, 112, 112A gains. */
  function partsAt(p, threshold) {
    const q = { ...p }; let cut = (p.normalTI + p.stEq + p.ltEq + p.ltOt) - threshold;
    for (const k of ['normalTI', 'stEq', 'ltOt', 'ltEq']) { const d = Math.min(cut, q[k]); q[k] -= d; cut -= d; }
    q.div = Math.min(q.div, q.normalTI);
    return q;
  }

  /* Set a loss off against gains in the given order; returns the unabsorbed loss. */
  function setOff(g, loss, keys) {
    for (const k of keys) { const d = Math.min(loss, g[k]); g[k] -= d; loss -= d; }
    return loss;
  }

  /* Full tax for income realised in quarters <= qMax.
     Capital gains, current-year capital losses and dividends are gated by quarter; everything else accrues fully. */
  function computeTax(inp, qMax) {
    if (qMax === undefined) qMax = 4;
    const inQ = q => q === 'even' || q === undefined ? (qMax / 4) : (Number(q) <= qMax ? 1 : 0);
    const ent = inp.entity || 'ind', firm = ent === 'firm', ind = ent === 'ind';
    const regime = firm ? 'new' : inp.regime, isNew = regime === 'new';
    const age = ind ? inp.age : 'lt60';
    const res = inp.resident !== 'nr';
    const C = R.oldRegimeCaps;

    // Capital gains realised so far, then loss set-off (current year and brought forward)
    const g = { stOt: inp.stcgOt * inQ(inp.stcgOtQ), stEq: inp.stcgEq * inQ(inp.stcgEqQ), ltOt: inp.ltcgOt * inQ(inp.ltcgOtQ), ltEq: inp.ltcgEq * inQ(inp.ltcgEqQ) };
    let ltl = (inp.ltLoss || 0) * inQ(inp.lossQ) + (inp.bfLtLoss || 0);
    let stl = (inp.stLoss || 0) * inQ(inp.lossQ) + (inp.bfStLoss || 0);
    ltl = setOff(g, ltl, ['ltOt', 'ltEq']);                 // long-term loss: only against long-term gains
    stl = setOff(g, stl, ['stOt', 'stEq', 'ltOt', 'ltEq']); // short-term loss: highest-taxed gains first
    const div = inp.div * inQ(inp.divQ);

    // Heads of income
    const salary = firm ? 0 : inp.salary;
    const sd = isNew ? R.standardDeduction.new : R.standardDeduction.old;
    const sal = ind && salary > 0 ? Math.max(0, salary - Math.min(salary, sd) - (isNew ? 0 : inp.dHra)) : 0;
    const intH = inp.fdInt + inp.savInt;
    const nav = Math.max(0, inp.rent - inp.muniTax);
    let hp = nav * 0.7 - inp.rentLoanInt;
    if (!isNew && !firm) hp -= Math.min(C.selfOccInterest, inp.dSelfOcc);
    const hpUsed = isNew ? Math.max(0, hp) : Math.max(hp, -C.hpLossSetOff); // new regime: no inter-head set-off
    let biz = 0;
    if (inp.bizType === '44ada' || inp.bizType === '44ad') biz = inp.bizReceipts * inp.bizPct / 100;
    else if (inp.bizType === 'reg') biz = inp.bizProfit;
    const gti = Math.max(0, sal + intH + hpUsed + biz + inp.otherInc + div + g.stOt);

    // Deductions (only against slab-rate income). Employer NPS capped at 14% / 10% of salary.
    const npsAllowed = ind ? Math.min(inp.empNps, salary * R.employerNpsCap[isNew ? 'new' : 'old']) : 0;
    let ded = npsAllowed;
    if (!isNew && !firm) {
      ded += Math.min(C.c80, inp.d80c) + inp.d80d + inp.dOther;
      if (ind) ded += Math.min(C.ccd1b, inp.d80ccd1b);
      ded += ind && age !== 'lt60' ? Math.min(C.ttb, inp.fdInt + inp.savInt) : Math.min(C.tta, inp.savInt);
    }
    ded = Math.min(ded, gti);
    const normalTI = gti - ded;

    const p = { firm, ind, regime, age, res, normalTI, stEq: g.stEq, ltEq: g.ltEq, ltOt: g.ltOt, div };
    const b = baseTax(p);
    const totalIncome = normalTI + g.stEq + g.ltEq + g.ltOt;

    // Surcharge with exact marginal relief: total tax may not exceed tax at the threshold plus the income above it
    let band = null;
    if (firm) { if (totalIncome > R.firm.surchargeAbove) band = { above: R.firm.surchargeAbove, rate: R.firm.surcharge, prev: 0 }; }
    else band = R.surcharge.find(x => totalIncome > x.above && (!x.oldOnly || !isNew)) || null;
    const sr = band ? band.rate : 0;
    let surcharge = surchargeAt(p, b, sr), marginalRelief = 0;
    if (band) {
      const pt = partsAt(p, band.above), bt = baseTax(pt);
      const cap = bt.taxAR + surchargeAt(pt, bt, band.prev) + (totalIncome - band.above);
      const allowed = Math.max(0, cap - b.taxAR);
      if (surcharge > allowed) { marginalRelief = surcharge - allowed; surcharge = allowed; }
    }
    const cess = (b.taxAR + surcharge) * R.cess;
    const total = Math.round(b.taxAR + surcharge + cess);
    return { normalTax: b.normalTax, rebate: b.rebate, stcgTax: b.stcgTax, ltcgTax: b.ltcgTax, surcharge, marginalRelief, cess, total,
      totalIncome, normalTI, ded, sr, npsAllowed, npsCapped: ind && inp.empNps > npsAllowed,
      gains: g, lossCarry: { st: stl, lt: ltl }, entity: ent };
  }

  /* Layered attribution: salary first, then the rest; each layer's extra tax. Sums exactly to the total. */
  const ZERO_KEYS = { sal: ['salary', 'empNps', 'dHra'], int: ['fdInt', 'savInt'], rent: ['rent', 'muniTax', 'rentLoanInt'], biz: ['bizReceipts', 'bizProfit'], div: ['div'], cg: ['stcgEq', 'ltcgEq', 'stcgOt', 'ltcgOt', 'stLoss', 'ltLoss', 'bfStLoss', 'bfLtLoss'], oth: ['otherInc'] };
  function zeroed(inp, keys) { const o = { ...inp }; keys.forEach(k => (ZERO_KEYS[k] || []).forEach(f => o[f] = 0)); return o; }
  function drivers(inp) {
    const order = ['sal', 'int', 'rent', 'biz', 'div', 'oth', 'cg'];
    const out = []; let prev = 0;
    for (let i = 0; i < order.length; i++) {
      const t = computeTax(zeroed(inp, order.slice(i + 1)), 4).total;
      out.push({ k: order[i], v: Math.max(0, t - prev) }); prev = Math.max(prev, t);
    }
    return out;
  }

  /* Blank input set; callers override what they know. */
  function emptyInputs() {
    return {
      entity: 'ind', regime: 'new', age: 'lt60', resident: 'r', payMonth: 7,
      salary: 0, empNps: 0, tdsSalary: 0, fdInt: 0, savInt: 0, tdsInt: 0,
      rent: 0, muniTax: 0, rentLoanInt: 0, tdsRent: 0,
      stcgEq: 0, stcgEqQ: 'even', ltcgEq: 0, ltcgEqQ: 'even', stcgOt: 0, stcgOtQ: 'even', ltcgOt: 0, ltcgOtQ: 'even',
      div: 0, divQ: 'even', tdsDiv: 0, stLoss: 0, ltLoss: 0, lossQ: 'even', bfStLoss: 0, bfLtLoss: 0, bizType: 'none', bizReceipts: 0, bizPct: 50, bizProfit: 0, tdsBiz: 0,
      otherInc: 0, tcs: 0, d80c: 0, d80ccd1b: 0, d80d: 0, dHra: 0, dSelfOcc: 0, dOther: 0, paid: [0, 0, 0, 0]
    };
  }

  /* Advance-tax plan: installments, 234B / 234C interest, catch-up plan. */
  function calcPlan(inp, today) {
    const iRate = AT.interestRate;
    const tds = inp.tdsSalary + inp.tdsInt + inp.tdsRent + inp.tdsDiv + inp.tdsBiz;
    const credit = tds + inp.tcs;
    const full = computeTax(inp, 4);
    const netFull = Math.max(0, full.total - credit);
    const presumptive = (inp.bizType === '44ada' || inp.bizType === '44ad');
    const seniorExempt = ((inp.entity || 'ind') === 'ind' && inp.resident !== 'nr' && inp.age !== 'lt60' && inp.bizType === 'none');
    const applicable = netFull >= AT.threshold && !seniorExempt;
    const netQ = [1, 2, 3, 4].map(q => Math.max(0, computeTax(inp, q).total - credit));
    const req = presumptive ? [0, 0, 0, netFull] : PCT.map((p, i) => Math.round(p * netQ[i]));
    const cumPaid = inp.paid.reduce((a, v, i) => { a.push((a[i - 1] || 0) + v); return a; }, []);
    const paidTotal = cumPaid[3];
    const passed = DUE.map(d => today > d);
    let nextIdx = passed.indexOf(false);
    if (presumptive && nextIdx !== -1) nextIdx = 3;

    const c234 = [0, 0, 0, 0], c234f = [0, 0, 0, 0]; let c234tot = 0, c234ftot = 0;
    const int100 = (amt, months) => Math.round(Math.floor(amt / 100) * 100 * iRate * months);
    if (applicable) {
      for (let i = 0; i < 4; i++) {
        const months = i === 3 ? 1 : 3;
        if (passed[i]) {
          let short = Math.max(0, req[i] - cumPaid[i]);
          if (!presumptive && i < 2 && cumPaid[i] >= AT.safeHarbour[i] * netQ[i]) short = 0;
          c234[i] = int100(short, months); c234tot += c234[i];
        } else {
          c234f[i] = int100(Math.max(0, req[i] - paidTotal), months); c234ftot += c234f[i];
        }
      }
    }
    let b234 = 0; const bMonths = Math.max(1, inp.payMonth - 3);
    if (applicable && paidTotal < AT.b234Threshold * netFull) b234 = int100(netFull - paidTotal, bMonths);

    const plan = []; let running = paidTotal;
    if (applicable) for (let i = 0; i < 4; i++) {
      if (passed[i]) continue;
      const add = Math.max(0, req[i] - running); plan.push({ i, add, cum: req[i] }); running = Math.max(running, req[i]);
    }
    const nx = plan.find(x => x.i === nextIdx);
    const owe = nextIdx === -1 ? Math.max(0, netFull - paidTotal) : (nx ? nx.add : 0);
    const saveNext = nextIdx >= 0 && applicable ? c234f[nextIdx] : 0;
    return { inp, tds, credit, full, netFull, applicable, seniorExempt, presumptive, req, netQ, cumPaid, paidTotal, passed, nextIdx, c234, c234tot, c234f, c234ftot, b234, bMonths, plan, owe, saveNext, today };
  }

  const API = { RULES: R, DUE, DUE_LBL, DUE_SHORT, PCT, FY_START, FY_END, exLimit, slabTax, computeTax, drivers, emptyInputs, calcPlan };
  Object.assign(root, API);
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
