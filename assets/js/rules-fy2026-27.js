/* MunVari — tax rules for FY 2026-27 (tax year 2026-27, Income-tax Act 2025, Budget 2026 rates).
 * Every number the engine uses lives here. For a new financial year, copy this file,
 * update the values, and point index.html at the new file. Then run `node --test`.
 */
(function (root) {
  const RULES = {
    fy: '2026-27',
    label: 'FY 2026-27 · Tax year 2026-27',
    verified: '2026-11-12',
    // Basic exemption limits
    exemption: { new: 400000, old: { lt60: 250000, s60: 300000, s80: 500000 } },
    // Slabs as [upper limit, rate]; the old-regime first band is replaced by the age-based exemption
    slabs: {
      new: [[400000, 0], [800000, 0.05], [1200000, 0.10], [1600000, 0.15], [2000000, 0.20], [2400000, 0.25], [Infinity, 0.30]],
      old: [[null, 0], [500000, 0.05], [1000000, 0.20], [Infinity, 0.30]]
    },
    standardDeduction: { new: 75000, old: 50000 },
    rebate87A: { new: { limit: 1200000, max: 60000 }, old: { limit: 500000, max: 12500 } },
    capitalGains: { stcg111A: 0.20, ltcg: 0.125, ltcg112AExempt: 125000 },
    surcharge: [ // [income above, rate]; old regime only for the 37% band
      { above: 50000000, rate: 0.37, prev: 0.25, oldOnly: true },
      { above: 20000000, rate: 0.25, prev: 0.15 },
      { above: 10000000, rate: 0.15, prev: 0.10 },
      { above: 5000000, rate: 0.10, prev: 0 }
    ],
    surchargeCapOnGains: 0.15,
    cess: 0.04,
    // Employer contribution to NPS: cap as a share of salary (basic + DA; MunVari uses gross salary as entered)
    employerNpsCap: { new: 0.14, old: 0.10 },
    // Partnership firms (incl. LLPs): flat rate, surcharge above ₹1 crore
    firm: { rate: 0.30, surchargeAbove: 10000000, surcharge: 0.12 },
    // Section references: Income-tax Act, 2025 with the Income-tax Act, 1961 equivalent
    sections: {
      advanceTax: { new: '404', old: '208' },
      int234B: { new: '424', old: '234B' },
      int234C: { new: '425', old: '234C' },
      rebate: { new: '156', old: '87A' },
      presumptive: { new: '58', old: '44AD/44ADA' }
      // Deduction and capital-gains labels (80C, 111A, 112A…) are kept as the 1961 numbers until the official mapping is confirmed
    },
    oldRegimeCaps: { c80: 150000, ccd1b: 50000, selfOccInterest: 200000, hpLossSetOff: 200000, tta: 10000, ttb: 50000 },
    advanceTax: {
      threshold: 10000,
      // JS months are 0-based: 5 = June
      due: [[2026, 5, 15], [2026, 8, 15], [2026, 11, 15], [2027, 2, 15]],
      dueLabel: ['15 Jun 2026', '15 Sep 2026', '15 Dec 2026', '15 Mar 2027'],
      dueShort: ['15 Jun', '15 Sep', '15 Dec', '15 Mar'],
      cumulative: [0.15, 0.45, 0.75, 1.00],
      safeHarbour: [0.12, 0.36], // 234C relief for June and September
      fyStart: [2026, 3, 1], fyEnd: [2027, 2, 31],
      interestRate: 0.01, // 234B / 234C, per month
      b234Threshold: 0.90
    },
    presumptive: { a44adaLimit: 7500000, a44adLimit: 30000000, a44adaPct: 50, a44adPct: 8 }
  };
  root.RULES = RULES;
  if (typeof module !== 'undefined' && module.exports) module.exports = RULES;
})(typeof globalThis !== 'undefined' ? globalThis : this);
