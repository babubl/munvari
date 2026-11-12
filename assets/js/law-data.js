/* MunVari — Income-tax Act, 2025 reference data.
 * Plain-English summaries written for MunVari; they are not the text of the law.
 * Old numbers are the Income-tax Act, 1961 equivalents. Verified against the Income Tax Department
 * where possible; third-party mappings are marked in sources.html. Last checked 12 Nov 2026.
 */
(function (root) {
  const LAW = {
    act: {
      name: 'Income-tax Act, 2025',
      assent: '21 August 2025',
      commenced: '1 April 2026',
      sections: 536, chapters: 23, schedules: 16,
      replaced: { name: 'Income-tax Act, 1961', sections: 819, schedules: 14, chapters: 47 },
      rules: { name: 'Income-tax Rules, 2026', rules: 333, forms: 190, oldRules: 511, oldForms: 399 }
    },

    chapters: [
      { n: 'I', title: 'Preliminary', from: 1, to: 3, about: 'Short title, definitions, and the meaning of "tax year", which replaces previous year and assessment year.' },
      { n: 'II', title: 'Basis of charge', from: 4, to: 10, about: 'What is taxed and whose income: the charge of tax, scope of total income, residential status, and income deemed to arise in India.' },
      { n: 'III', title: 'Incomes which do not form part of total income', from: 11, to: 12, about: 'Exempt income. Most of the old section 10 exemptions now sit in Schedules II to VIII.' },
      { n: 'IV', title: 'Computation of total income', from: 13, to: 95, about: 'The five heads of income: salaries, house property, business or profession, capital gains, and other sources.' },
      { n: 'V', title: 'Income of other persons included in total income', from: 96, to: 100, about: 'Clubbing: when a spouse\'s or minor child\'s income, or income from transferred assets, is taxed in your hands.' },
      { n: 'VI', title: 'Aggregation of income', from: 101, to: 107, about: 'Adding up total income, and taxing unexplained credits, investments, assets and expenditure.' },
      { n: 'VII', title: 'Set off, or carry forward and set off of losses', from: 108, to: 121, about: 'Which losses can reduce which income, and how long they carry forward.' },
      { n: 'VIII', title: 'Deductions to be made in computing total income', from: 122, to: 154, about: 'The old Chapter VI-A deductions: 80C, 80D, 80E, 80G, 80TTA and the rest.' },
      { n: 'IX', title: 'Rebates and reliefs', from: 155, to: 160, about: 'The rebate for resident individuals, relief for arrears of salary, and relief from double taxation.' },
      { n: 'X', title: 'Special provisions relating to avoidance of tax', from: 161, to: 177, about: 'Transfer pricing and other anti-avoidance rules for cross-border and related-party transactions.' },
      { n: 'XI', title: 'General anti-avoidance rule', from: 178, to: 184, about: 'GAAR: power to disregard arrangements whose main purpose is a tax benefit.' },
      { n: 'XII', title: 'Mode of payment in certain cases, etc.', from: 185, to: 189, about: 'Limits on cash loans, deposits and receipts, and the electronic payment modes the law requires.' },
      { n: 'XIII', title: 'Determination of tax in special cases', from: 190, to: 235, about: 'Special tax rates: capital gains, the new tax regime, companies, crypto and other special incomes.' },
      { n: 'XIV', title: 'Tax administration', from: 236, to: 261, about: 'Income-tax authorities, their powers, and searches and surveys.' },
      { n: 'XV', title: 'Return of income', from: 262, to: 267, about: 'PAN, filing returns, verification, self-assessment tax and updated returns.' },
      { n: 'XVI', title: 'Procedure for assessment', from: 268, to: 301, about: 'Processing of returns, scrutiny, reassessment and time limits.' },
      { n: 'XVII', title: 'Special provisions relating to certain persons', from: 302, to: 355, about: 'Rules for particular taxpayers, including charities and registered non-profit organisations.' },
      { n: 'XVIII', title: 'Appeals, revisions and alternate dispute resolutions', from: 356, to: 389, about: 'Appeals to the Commissioner (Appeals), the Tribunal and courts, and dispute resolution routes.' },
      { n: 'XIX', title: 'Collection and recovery of tax', from: 390, to: 430, about: 'TDS, TCS, advance tax, interest for defaults, and recovery of tax.' },
      { n: 'XX', title: 'Refunds', from: 431, to: 438, about: 'Who gets a refund and the interest paid on refunds.' },
      { n: 'XXI', title: 'Penalties', from: 439, to: 472, about: 'Penalties for under-reporting income and for compliance failures.' },
      { n: 'XXII', title: 'Offences and prosecution', from: 473, to: 498, about: 'Criminal offences such as wilful evasion and failure to file, and compounding.' },
      { n: 'XXIII', title: 'Miscellaneous', from: 499, to: 536, about: 'Power to make rules, removal of difficulties, repeal of the 1961 Act and savings.' }
    ],

    schedules: [
      { n: 'I', sec: '9', title: 'Eligible investment funds', about: 'Conditions under which a fund managed from India is not treated as having a business connection in India.' },
      { n: 'II', sec: '11', title: 'Exempt income: general', about: 'Exemptions open to everyone, such as agricultural income, life insurance proceeds and PF and Sukanya Samriddhi receipts.' },
      { n: 'III', sec: '11', title: 'Exempt income: eligible persons', about: 'Exemptions tied to who you are or what you receive, such as HRA, leave travel concession, a partner\'s share of firm profit and gallantry pensions.' },
      { n: 'IV', sec: '11', title: 'Exempt income: eligible non-residents', about: 'Exemptions for non-residents, such as NRE account interest.' },
      { n: 'V', sec: '11', title: 'Exempt income: investment funds and unit holders', about: 'Pass-through exemptions for investment funds, REITs and InvITs.' },
      { n: 'VI', sec: '11', title: 'Exempt income: IFSC', about: 'Exemptions for units in or income from an International Financial Services Centre.' },
      { n: 'VII', sec: '11', title: 'Fully exempt persons', about: 'Persons whose income is wholly exempt, such as the RBI, SEBI, registered mutual funds and specified bodies.' },
      { n: 'VIII', sec: '12', title: 'Political parties and electoral trusts', about: 'Conditions for exempting the income of political parties and electoral trusts.' },
      { n: 'IX', sec: '33', title: 'Depreciation rates', about: 'Rates of depreciation for tangible and intangible business assets.' },
      { n: 'X', sec: '49', title: 'Site restoration fund', about: 'Deduction for deposits by petroleum and natural gas businesses.' },
      { n: 'XI', sec: '2', title: 'Recognised provident funds', about: 'Rules for recognised PFs: contribution limits, taxable interest and withdrawals.' },
      { n: 'XII', sec: '51', title: 'Minerals', about: 'Minerals eligible for the special prospecting deduction.' },
      { n: 'XIII', sec: '—', title: 'Articles for special depreciation', about: 'Articles and things that attract a special depreciation rate.' },
      { n: 'XIV', sec: '—', title: 'Patent royalty rates', about: 'Tax rates connected with patent royalties.' },
      { n: 'XV', sec: '123', title: 'Qualifying investments and payments (80C basket)', about: 'The list behind the ₹1.5 lakh deduction: PF, PPF, ELSS, life insurance, home loan principal, tuition fees and similar.' },
      { n: 'XVI', sec: '—', title: 'Investments by non-profits', about: 'Permitted modes in which registered non-profit organisations may invest their funds.' }
    ],

    /* Key sections. cat: basics | salary | property | business | gains | other | clubbing | losses | deductions | rates | filing | tds | interest | refund */
    sections: [
      { s: '2', o: '2', t: 'Definitions', cat: 'basics', d: 'Defines the terms used across the Act, such as person, income, capital asset and transfer.' },
      { s: '3', o: '3', t: 'Tax year', cat: 'basics', d: '"Tax year" replaces previous year and assessment year. Tax year 2026-27 runs from 1 April 2026 to 31 March 2027.' },
      { s: '4', o: '4', t: 'Charge of income-tax', cat: 'basics', d: 'Income-tax is charged each tax year at the rates set by the Finance Act on the total income of every person.' },
      { s: '5', o: '5', t: 'Scope of total income', cat: 'basics', d: 'Residents are taxed on worldwide income; non-residents only on income received, accruing or deemed to arise in India.' },
      { s: '6', o: '6', t: 'Residence in India', cat: 'basics', d: 'Tests for resident, resident but not ordinarily resident, and non-resident, mainly based on days spent in India.' },
      { s: '9', o: '9', t: 'Income deemed to accrue in India', cat: 'basics', d: 'When income of a non-resident is treated as arising in India, for example through a business connection or Indian property.' },
      { s: '11', o: '10', t: 'Income not included in total income', cat: 'basics', d: 'Exempt income. The individual exemptions are listed in Schedules II to VII.' },
      { s: '13', o: '14', t: 'Heads of income', cat: 'basics', d: 'Income is computed under five heads: salaries, house property, business or profession, capital gains, and other sources.' },

      { s: '15', o: '15', t: 'Salaries', cat: 'salary', d: 'Salary is taxed when due or when received, whichever is earlier, including advance salary and arrears.' },
      { s: '16', o: '17', t: 'Income from salary', cat: 'salary', d: 'What counts as salary: wages, pension, gratuity, fees, commission, leave encashment and similar receipts.' },
      { s: '17', o: '17(2)', t: 'Perquisites', cat: 'salary', d: 'Taxable perks from an employer, such as rent-free housing, car, ESOPs and certain contributions.' },
      { s: '19', o: '16, 10(10)…', t: 'Deductions from salaries', cat: 'salary', d: 'Standard deduction (₹75,000 new regime, ₹50,000 old), professional tax, entertainment allowance for government staff, and exempt retirement receipts such as gratuity and leave encashment within limits.' },

      { s: '20', o: '22', t: 'Income from house property', cat: 'property', d: 'The annual value of a building or land you own is taxed under this head, unless you use it for your own business.' },
      { s: '21', o: '23', t: 'Annual value', cat: 'property', d: 'How annual value is worked out: rent received or receivable, less municipal taxes paid. Up to two self-occupied homes have nil annual value.' },
      { s: '22', o: '24', t: 'Deductions from house property', cat: 'property', d: '30% standard deduction on annual value, plus home-loan interest. Interest on a self-occupied home is capped at ₹2 lakh and allowed only in the old regime.' },
      { s: '23', o: '25A', t: 'Arrears and unrealised rent', cat: 'property', d: 'Rent arrears or unrealised rent received later are taxed in the year received, after a 30% deduction.' },

      { s: '26', o: '28', t: 'Profits and gains of business or profession', cat: 'business', d: 'What is taxed as business or professional income. F&O trading is business income; intraday equity trading is speculative business.' },
      { s: '33', o: '32', t: 'Depreciation', cat: 'business', d: 'Deduction for wear and tear on business assets, at the rates in Schedule IX.' },
      { s: '34', o: '37', t: 'General deductions', cat: 'business', d: 'Business expenses wholly and exclusively for the business are deductible unless capital or personal in nature.' },
      { s: '35', o: '40', t: 'Amounts not deductible', cat: 'business', d: 'Disallowances, for example when TDS was required on a payment but not deducted or paid.' },
      { s: '37', o: '43B', t: 'Deductions on actual payment', cat: 'business', d: 'Certain expenses, such as taxes, bonus, interest to banks and dues to micro and small enterprises, are deductible only when paid.' },
      { s: '58', o: '44AD, 44ADA, 44AE', t: 'Presumptive taxation', cat: 'business', d: 'Small businesses (turnover up to ₹3 crore with mostly digital receipts) can declare 6% or 8% of turnover as profit; professionals (receipts up to ₹75 lakh) can declare 50%. No books needed, and advance tax is due in one installment by 15 March.' },
      { s: '62', o: '44AA', t: 'Books of account', cat: 'business', d: 'Who must keep books of account and documents.' },
      { s: '63', o: '44AB', t: 'Tax audit', cat: 'business', d: 'Who needs a tax audit, generally businesses with turnover above ₹1 crore (₹10 crore if cash is under 5%) and professionals with receipts above ₹50 lakh.' },

      { s: '67', o: '45', t: 'Capital gains', cat: 'gains', d: 'Profit on transferring a capital asset, such as shares, mutual funds, property or gold, is taxed as capital gains in the year of transfer.' },
      { s: '72', o: '48', t: 'Computing capital gains', cat: 'gains', d: 'Sale value less cost of acquisition, cost of improvement and transfer expenses. Indexation is no longer available, except a choice for property bought before 23 July 2024.' },
      { s: '76', o: '50AA', t: 'Market-linked debentures and specified funds', cat: 'gains', d: 'Gains on market-linked debentures and on debt mutual funds bought on or after 1 April 2023 are always short-term, taxed at slab rate.' },
      { s: '78', o: '50C', t: 'Stamp duty value for property', cat: 'gains', d: 'If a property sells below its stamp duty value (beyond a 10% tolerance), the stamp duty value is taken as the sale price.' },
      { s: '82', o: '54', t: 'Exemption: residential house', cat: 'gains', d: 'Long-term gains on selling a house are exempt if reinvested in another house in India within the time limits, up to ₹10 crore.' },
      { s: '85', o: '54EC', t: 'Exemption: specified bonds', cat: 'gains', d: 'Long-term gains on land or building are exempt up to ₹50 lakh if invested in specified bonds within six months.' },
      { s: '86', o: '54F', t: 'Exemption: other assets into a house', cat: 'gains', d: 'Long-term gains on any asset other than a house are exempt if the net sale value is invested in a residential house.' },
      { s: '196', o: '111A', t: 'Short-term gains on listed equity', cat: 'rates', d: 'STCG on listed shares and equity mutual funds (STT paid) is taxed at 20%.' },
      { s: '197', o: '112', t: 'Long-term capital gains', cat: 'rates', d: 'LTCG on other assets is taxed at 12.5% without indexation. Resident individuals and HUFs with property bought before 23 July 2024 may choose 20% with indexation.' },
      { s: '198', o: '112A', t: 'Long-term gains on listed equity', cat: 'rates', d: 'LTCG on listed shares and equity mutual funds (STT paid) is taxed at 12.5% above ₹1.25 lakh a year.' },
      { s: '202', o: '115BAC', t: 'New tax regime', cat: 'rates', d: 'The default regime for individuals and HUFs: lower slab rates with few deductions. Salaried taxpayers can choose the old regime each year when filing; those with business income can switch back only once.' },

      { s: '92', o: '56', t: 'Income from other sources', cat: 'other', d: 'Interest, dividends, gifts above ₹50,000 from non-relatives, family pension, lottery and other income not under another head.' },
      { s: '93', o: '57', t: 'Deductions from other sources', cat: 'other', d: 'Allowed deductions, such as a standard deduction on family pension and limited interest expense against dividends.' },

      { s: '99', o: '64', t: 'Clubbing of income', cat: 'clubbing', d: 'Income from assets gifted to a spouse or daughter-in-law, and most income of a minor child, is added to your income.' },

      { s: '108', o: '70', t: 'Set off within the same head', cat: 'losses', d: 'A loss in one source can reduce income from another source under the same head; a long-term capital loss only reduces long-term gains.' },
      { s: '109', o: '71', t: 'Set off across heads', cat: 'losses', d: 'Losses can reduce income under other heads, with limits: house property loss up to ₹2 lakh, and no set-off of capital losses against other heads.' },
      { s: '110', o: '71B', t: 'Carry forward of house property loss', cat: 'losses', d: 'Unabsorbed house property loss carries forward for 8 years against house property income only.' },
      { s: '111', o: '74', t: 'Carry forward of capital loss', cat: 'losses', d: 'Capital losses carry forward for 8 years; long-term losses only against long-term gains.' },
      { s: '112', o: '72', t: 'Carry forward of business loss', cat: 'losses', d: 'Business losses carry forward for 8 years against business income.' },
      { s: '113', o: '73', t: 'Speculation losses', cat: 'losses', d: 'Speculative business losses, such as intraday equity trading, can only be set off against speculative income, for 4 years.' },
      { s: '121', o: '80', t: 'Return needed for losses', cat: 'losses', d: 'Losses carry forward only if the return for the loss year was filed by the due date.' },

      { s: '123', o: '80C, 80CCC, 80CCE', t: 'Investments and payments (80C)', cat: 'deductions', d: 'Up to ₹1.5 lakh for PF, PPF, ELSS, life insurance, home loan principal, tuition fees and others in Schedule XV. Old regime only.' },
      { s: '124', o: '80CCD', t: 'Pension scheme (NPS)', cat: 'deductions', d: 'Your own NPS contribution (old regime, extra ₹50,000) and the employer\'s contribution (both regimes, up to 14% of salary in the new regime, 10% in the old).' },
      { s: '125', o: '80CCH', t: 'Agnipath scheme', cat: 'deductions', d: 'Contributions to the Agniveer Corpus Fund.' },
      { s: '126', o: '80D', t: 'Health insurance', cat: 'deductions', d: 'Health insurance premiums and preventive check-ups: up to ₹25,000 for self and family, ₹50,000 for senior parents. Old regime only.' },
      { s: '127', o: '80DD', t: 'Dependant with disability', cat: 'deductions', d: 'Fixed deduction for maintaining a dependant with a disability. Old regime only.' },
      { s: '128', o: '80DDB', t: 'Treatment of specified illnesses', cat: 'deductions', d: 'Medical treatment of specified diseases for self or dependants. Old regime only.' },
      { s: '129', o: '80E', t: 'Education loan interest', cat: 'deductions', d: 'Interest on a loan for higher education, for up to 8 years, with no cap. Old regime only.' },
      { s: '133', o: '80G', t: 'Donations', cat: 'deductions', d: 'Donations to approved funds and charities, at 50% or 100%, some subject to a limit. Cash donations above ₹2,000 are not allowed. Old regime only.' },
      { s: '134', o: '80GG', t: 'Rent paid without HRA', cat: 'deductions', d: 'For people who pay rent but get no HRA, within set limits. Old regime only.' },
      { s: '137', o: '80GGC', t: 'Contributions to political parties', cat: 'deductions', d: 'Contributions to registered political parties, other than in cash. Old regime only.' },
      { s: '153', o: '80TTA, 80TTB', t: 'Interest on deposits', cat: 'deductions', d: 'Savings interest up to ₹10,000; for senior citizens, bank and post office deposit interest up to ₹50,000. Old regime only.' },
      { s: '154', o: '80U', t: 'Person with disability', cat: 'deductions', d: 'Fixed deduction for a resident individual with a disability. Old regime only.' },

      { s: '156', o: '87A', t: 'Rebate for resident individuals', cat: 'rates', d: 'New regime: tax is nil up to ₹12 lakh of income (rebate up to ₹60,000), with marginal relief just above. Old regime: up to ₹12,500 for income up to ₹5 lakh. Not available against tax on 111A or 112A gains in the new regime.' },
      { s: '157', o: '89', t: 'Relief for arrears of salary', cat: 'rates', d: 'Relief when salary arrears or advance push income into a higher slab in the year received.' },
      { s: '159', o: '90, 90A', t: 'Tax treaties', cat: 'rates', d: 'Relief under India\'s double taxation avoidance agreements (DTAAs) with other countries.' },
      { s: '160', o: '91', t: 'Relief without a treaty', cat: 'rates', d: 'Relief for tax paid in a country that has no treaty with India.' },

      { s: '262', o: '139A, 139AA', t: 'PAN and Aadhaar', cat: 'filing', d: 'Who must have a PAN, where to quote it, and linking PAN with Aadhaar.' },
      { s: '263', o: '139', t: 'Return of income', cat: 'filing', d: 'Who must file and by when, plus belated and revised returns. Filing is required if income exceeds the basic exemption limit or for certain transactions, such as large deposits or foreign assets.' },
      { s: '265', o: '140', t: 'Verifying the return', cat: 'filing', d: 'A return is valid only once verified, usually by e-verification within 30 days of filing.' },
      { s: '266', o: '140A', t: 'Self-assessment tax', cat: 'filing', d: 'Any tax still due, with interest, must be paid before filing the return.' },
      { s: '267', o: '140B', t: 'Updated return (ITR-U)', cat: 'filing', d: 'Lets you report missed income up to 48 months after the end of the tax year, with extra tax of 25% to 70% of the additional tax and interest.' },

      { s: '393', o: '192–206', t: 'Tax deducted at source (TDS)', cat: 'tds', d: 'One consolidated section, organised in tables, replaces the old TDS sections such as 192 (salary), 194A (interest), 194C (contracts) and 194J (fees). It also covers nil-TDS declarations (old Forms 15G and 15H).' },
      { s: '404', o: '207, 208', t: 'Advance tax', cat: 'tds', d: 'Pay tax in installments during the year if your tax after TDS is ₹10,000 or more. Resident senior citizens with no business income are exempt.' },
      { s: '424', o: '234B', t: 'Interest: advance tax shortfall', cat: 'interest', d: '1% a month from 1 April after the tax year if advance tax paid is less than 90% of the tax assessed.' },
      { s: '425', o: '234C', t: 'Interest: late installments', cat: 'interest', d: '1% a month on shortfalls against the 15%, 45%, 75% and 100% installments. Relief for capital gains and dividends that arise later in the year.' },
      { s: '428', o: '234F, 234I, 271B', t: 'Fees for late compliance', cat: 'interest', d: 'Late return: ₹5,000 (₹1,000 if income is up to ₹5 lakh). The same fee for a revised return filed after 31 December. Fees for late audit and transfer pricing reports.' },
      { s: '437', o: '244A', t: 'Interest on refunds', cat: 'refund', d: 'The department pays simple interest of 0.5% a month on refunds due to you.' }
    ],

    /* Key forms under the Income-tax Rules, 2026 (renumbered). Verify on the e-filing portal before relying on a number. */
    forms: [
      { f: 'ITR-1 to ITR-7', o: 'ITR-1 to ITR-7', t: 'Income tax returns', d: 'ITR-1 (Sahaj) for simple salary, one house and interest income up to ₹50 lakh; ITR-2 for capital gains or foreign assets; ITR-3 for business or professional income, including F&O; ITR-4 (Sugam) for presumptive income. Forms for tax year 2026-27 are notified before filing season opens.' },
      { f: 'Form 130', o: 'Form 16', t: 'TDS certificate: salary', d: 'Issued by your employer after the year ends; shows salary paid and tax deducted.' },
      { f: 'Form 131', o: 'Form 16A', t: 'TDS certificate: other payments', d: 'Issued for TDS on interest, rent, professional fees and other non-salary payments.' },
      { f: 'Form 168', o: 'Form 26AS / AIS', t: 'Annual statement', d: 'Your consolidated record of TDS, TCS, tax paid and reported financial transactions. Check it before filing.' },
      { f: 'Form 121', o: 'Forms 15G, 15H', t: 'Nil-TDS declaration', d: 'Give it to your bank if your total income is below the taxable limit, so no TDS is deducted on interest.' },
      { f: 'Form 124', o: 'Form 12BB', t: 'Investment declaration to employer', d: 'Proof of rent, investments and loans for TDS on salary. Now asks you to disclose any relationship with your landlord.' },
      { f: 'Form 44', o: 'Form 10-IEA', t: 'Choosing the old regime (business income)', d: 'Filed by people with business income who want to opt out of the new regime.' },
      { f: 'Form 41', o: 'Form 10F', t: 'Treaty benefit claim', d: 'Non-residents use it, with a tax residency certificate, to claim DTAA rates.' },
      { f: 'Form 26', o: 'Forms 3CA, 3CB, 3CD', t: 'Tax audit report', d: 'A single tax audit report replaces the earlier three forms.' }
    ],

    /* Due dates for returns of tax year 2026-27 (filed in 2027), per Budget 2026 changes. */
    dueDates: [
      { who: 'ITR-1 and ITR-2 (no audit)', when: '31 July 2027' },
      { who: 'ITR-3 and ITR-4, business or profession without audit', when: '31 August 2027' },
      { who: 'Tax audit report', when: '30 September 2027' },
      { who: 'Returns with tax audit', when: '31 October 2027' },
      { who: 'Returns with transfer pricing report', when: '30 November 2027' },
      { who: 'Belated return (after the due date)', when: '31 December 2027' },
      { who: 'Revised return (fee applies after 31 December)', when: '31 March 2028' },
      { who: 'Updated return (ITR-U)', when: '31 March 2031 (48 months)' }
    ]
  };
  root.LAW = LAW;
  if (typeof module !== 'undefined' && module.exports) module.exports = LAW;
})(typeof globalThis !== 'undefined' ? globalThis : this);
