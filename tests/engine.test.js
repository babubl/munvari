// Run: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../assets/js/engine.js');

const inp = o => ({ ...E.emptyInputs(), ...o });
const tax = o => E.computeTax(inp(o), 4);
const d = s => new Date(s + 'T12:00:00');

test('new regime: ₹12.75L salary is fully covered by the 87A rebate', () => {
  assert.equal(tax({ salary: 1275000 }).total, 0);
});

test('new regime: marginal relief just above ₹12L', () => {
  // TI 12.25L → slab tax 63,750; relief caps tax at income above 12L (25,000) + 4% cess
  assert.equal(tax({ salary: 1300000 }).total, 26000);
});

test('new regime: ₹20L salary', () => {
  // TI 19.25L: 20k + 40k + 60k + 65k = 1,85,000 + 4% cess
  assert.equal(tax({ salary: 2000000 }).total, 192400);
});

test('old regime: ₹10L salary, no deductions', () => {
  // TI 9.5L: 12,500 + 90,000 = 1,02,500 + 4% cess
  assert.equal(tax({ salary: 1000000, regime: 'old' }).total, 106600);
});

test('old regime: 80C is capped at ₹1.5L', () => {
  assert.equal(tax({ salary: 1000000, regime: 'old', d80c: 300000 }).total, tax({ salary: 1000000, regime: 'old', d80c: 150000 }).total);
});

test('old regime: senior citizen exemption limit is ₹3L', () => {
  assert.equal(E.slabTax(300000, 'old', 's60'), 0);
  assert.equal(E.slabTax(300000, 'old', 'lt60'), 2500);
});

test('equity LTCG up to ₹1.25L is tax-free', () => {
  const t = tax({ salary: 2000000, ltcgEq: 125000 });
  assert.equal(t.ltcgTax, 0);
});

test('equity LTCG above ₹1.25L taxed at 12.5%', () => {
  assert.equal(tax({ salary: 2000000, ltcgEq: 225000 }).ltcgTax, 12500);
});

test('87A rebate does not apply to STCG under the new regime', () => {
  const t = tax({ salary: 800000, stcgEq: 100000 });
  assert.equal(t.stcgTax, 20000);
  assert.ok(t.total >= 20800);
});

test('surcharge: 10% band above ₹50L', () => {
  assert.equal(tax({ otherInc: 6000000 }).sr, 0.10);
});

test('advance tax not applicable under ₹10,000 liability', () => {
  const r = E.calcPlan(inp({ salary: 1300000, tdsSalary: 20000 }), d('2026-07-01')); // 26,000 tax − 20,000 TDS
  assert.equal(r.applicable, false);
});

test('resident senior with no business income is exempt', () => {
  const r = E.calcPlan(inp({ age: 's60', fdInt: 3000000 }), d('2026-07-01'));
  assert.equal(r.seniorExempt, true);
  assert.equal(r.applicable, false);
});

test('234C: missed June installment costs 1% x 3 months on the shortfall', () => {
  const r = E.calcPlan(inp({ otherInc: 1500000 }), d('2026-07-01'));
  const shortfall = Math.floor(r.req[0] / 100) * 100;
  assert.equal(r.c234[0], Math.round(shortfall * 0.03));
  assert.equal(r.nextIdx, 1);
});

test('234C safe harbour: 12% paid by June means no June interest', () => {
  const base = E.calcPlan(inp({ otherInc: 1500000 }), d('2026-07-01'));
  const paid = Math.ceil(base.netFull * 0.12);
  const r = E.calcPlan(inp({ otherInc: 1500000, paid: [paid, 0, 0, 0] }), d('2026-07-01'));
  assert.equal(r.c234[0], 0);
});

test('presumptive (44ADA): single installment by 15 March', () => {
  const r = E.calcPlan(inp({ bizType: '44ada', bizReceipts: 4000000, bizPct: 50 }), d('2026-07-01'));
  assert.equal(r.nextIdx, 3);
  assert.deepEqual(r.req.slice(0, 3), [0, 0, 0]);
});

test('drivers sum exactly to the total tax', () => {
  const i = inp({ salary: 1800000, fdInt: 300000, ltcgEq: 400000, rent: 360000 });
  const sum = E.drivers(i).reduce((a, x) => a + x.v, 0);
  assert.equal(sum, E.computeTax(i, 4).total);
});

test('paying in full clears all projected interest', () => {
  const base = E.calcPlan(inp({ otherInc: 1500000 }), d('2026-05-01'));
  const r = E.calcPlan(inp({ otherInc: 1500000, paid: [base.netFull, 0, 0, 0] }), d('2026-05-01'));
  assert.equal(r.c234ftot + r.b234, 0);
});

// ---- v3.2: CA review fixes ----
test('employer NPS (s.124, old 80CCD(2)) capped at 14% of salary in the new regime', () => {
  const t = tax({ salary: 2000000, empNps: 500000 });
  assert.equal(t.npsAllowed, 280000);
  assert.equal(t.npsCapped, true);
});

test('employer NPS capped at 10% of salary in the old regime', () => {
  assert.equal(tax({ salary: 2000000, empNps: 500000, regime: 'old' }).npsAllowed, 200000);
});

test('short-term capital loss offsets STCG', () => {
  assert.equal(tax({ salary: 2000000, stcgEq: 200000, stLoss: 100000 }).stcgTax, 20000);
});

test('long-term capital loss cannot offset short-term gains and is carried forward', () => {
  const t = tax({ salary: 2000000, stcgEq: 100000, ltLoss: 100000 });
  assert.equal(t.stcgTax, 20000);
  assert.equal(t.lossCarry.lt, 100000);
});

test('short-term loss can offset LTCG; 112A exemption applies after set-off', () => {
  assert.equal(tax({ salary: 2000000, ltcgEq: 225000, stLoss: 100000 }).ltcgTax, 0);
});

test('brought-forward long-term loss offsets LTCG', () => {
  assert.equal(tax({ salary: 2000000, ltcgEq: 325000, bfLtLoss: 100000 }).ltcgTax, 12500);
});

test('exact marginal relief at the ₹50L surcharge threshold', () => {
  // Tax at 50L = 10,80,000; at 51L = 11,10,000 + surcharge capped so total <= 10,80,000 + 1,00,000
  const t = tax({ otherInc: 5100000 });
  assert.equal(Math.round(t.surcharge), 70000);
  assert.equal(t.total, 1227200);
});

test('HUF gets no rebate', () => {
  assert.equal(tax({ entity: 'huf', otherInc: 1000000 }).total, 41600);
  assert.equal(tax({ otherInc: 1000000 }).total, 0);
});

test('partnership firm: flat 30% plus cess', () => {
  assert.equal(tax({ entity: 'firm', bizType: 'reg', bizProfit: 5000000 }).total, 1560000);
});

test('firm: 12% surcharge above ₹1 crore with marginal relief', () => {
  // 30.3L tax; relief limits tax + surcharge to 30L + 1L
  assert.equal(tax({ entity: 'firm', bizType: 'reg', bizProfit: 10100000 }).total, 3224000);
});

test('firm is never exempt as a senior citizen', () => {
  const r = E.calcPlan(inp({ entity: 'firm', age: 's60', otherInc: 3000000 }), d('2026-07-01'));
  assert.equal(r.seniorExempt, false);
  assert.equal(r.applicable, true);
});
