# MunVari — CA review pack

Worked examples for a Chartered Accountant to check. Each figure below is produced by the live tax engine (`assets/js/engine.js`, rules in `assets/js/rules-fy2026-27.js`). Please mark each case **Agree** or **Disagree**, and for any disagreement give the figure you expect and the reason.

- Tax year 2026-27 (FY 2026-27), Income-tax Act, 2025, Budget 2026 rates
- "Today" for installment and interest status: 12 November 2026
- Nothing paid as advance tax so far in every case; balance assumed paid in July 2027
- Amounts in rupees; tax rounded to the nearest rupee, interest on amounts rounded down to the nearest ₹100

## Assumptions to confirm

1. Employer NPS (Sec 124, old 80CCD(2)) cap applied to gross salary entered, not basic + DA.
2. Surcharge marginal relief: income above the threshold is removed from slab income first, then 111A, 112 and 112A gains.
3. Tax on dividends for the 15% surcharge cap is apportioned in proportion to slab income.
4. Short-term capital losses are set off against slab-rate STCG first, then 111A STCG, then 112 LTCG, then 112A LTCG; the ₹1.25 lakh 112A exemption applies after set-off.
5. Rebate (Sec 156, old 87A) in the new regime is not allowed against 111A or 112A tax; marginal relief applies between ₹12L and the break-even point.
6. Capital gains, dividends and current-year capital losses are spread evenly across quarters unless a quarter is chosen; Sec 425 (old 234C) relief for them follows that timing.

## 1. Salaried, new regime, rebate fully covers tax

Inputs: salary: ₹12,75,000

| Item | MunVari | CA check |
|---|---:|---|
| Total income | ₹12,00,000 | |
| Income at slab / flat rate | ₹12,00,000 | |
| Tax on slab / flat income | ₹60,000 | |
| Tax on STCG (111A) | ₹0 | |
| Tax on LTCG (112 / 112A) | ₹0 | |
| Rebate (Sec 156) | ₹60,000 | |
| Surcharge after relief | ₹0 | |
| Cess | ₹0 | |
| **Total tax** | **₹0** | |
| TDS / TCS credit | ₹0 | |
| Net tax after credits | ₹0 | |
| Advance tax applicable? | No | |
| Cumulative due by 15 Jun / 15 Sep / 15 Dec / 15 Mar | ₹0 / ₹0 / ₹0 / ₹0 | |
| Sec 425 (234C) interest, installments already missed | ₹0 | |
| Sec 425 (234C) interest, upcoming if unpaid | ₹0 | |
| Sec 424 (234B) interest if balance paid Jul 2027 | ₹0 | |

Agree / Disagree: ______

## 2. Salaried just above ₹12L, new regime (rebate marginal relief)

Inputs: salary: ₹13,00,000

| Item | MunVari | CA check |
|---|---:|---|
| Total income | ₹12,25,000 | |
| Income at slab / flat rate | ₹12,25,000 | |
| Tax on slab / flat income | ₹63,750 | |
| Tax on STCG (111A) | ₹0 | |
| Tax on LTCG (112 / 112A) | ₹0 | |
| Rebate (Sec 156) | ₹38,750 | |
| Surcharge after relief | ₹0 | |
| Cess | ₹1,000 | |
| **Total tax** | **₹26,000** | |
| TDS / TCS credit | ₹0 | |
| Net tax after credits | ₹26,000 | |
| Advance tax applicable? | Yes | |
| Cumulative due by 15 Jun / 15 Sep / 15 Dec / 15 Mar | ₹3,900 / ₹11,700 / ₹19,500 / ₹26,000 | |
| Sec 425 (234C) interest, installments already missed | ₹468 | |
| Sec 425 (234C) interest, upcoming if unpaid | ₹845 | |
| Sec 424 (234B) interest if balance paid Jul 2027 | ₹1,040 | |

Agree / Disagree: ______

## 3. Salaried, old regime with 80C, 80D, HRA

Inputs: salary: ₹18,00,000, regime: old, d80c: ₹1,50,000, d80d: ₹25,000, dHra: ₹1,20,000, tdsSalary: ₹1,80,000

| Item | MunVari | CA check |
|---|---:|---|
| Total income | ₹14,55,000 | |
| Income at slab / flat rate | ₹14,55,000 | |
| Tax on slab / flat income | ₹2,49,000 | |
| Tax on STCG (111A) | ₹0 | |
| Tax on LTCG (112 / 112A) | ₹0 | |
| Rebate (Sec 156) | ₹0 | |
| Surcharge after relief | ₹0 | |
| Cess | ₹9,960 | |
| **Total tax** | **₹2,58,960** | |
| TDS / TCS credit | ₹1,80,000 | |
| Net tax after credits | ₹78,960 | |
| Advance tax applicable? | Yes | |
| Cumulative due by 15 Jun / 15 Sep / 15 Dec / 15 Mar | ₹11,844 / ₹35,532 / ₹59,220 / ₹78,960 | |
| Sec 425 (234C) interest, installments already missed | ₹1,419 | |
| Sec 425 (234C) interest, upcoming if unpaid | ₹2,565 | |
| Sec 424 (234B) interest if balance paid Jul 2027 | ₹3,156 | |

Agree / Disagree: ______

## 4. Salary + FD interest + equity LTCG (TDS covers salary only)

Inputs: salary: ₹24,00,000, tdsSalary: ₹4,00,000, fdInt: ₹3,00,000, ltcgEq: ₹5,00,000

| Item | MunVari | CA check |
|---|---:|---|
| Total income | ₹31,25,000 | |
| Income at slab / flat rate | ₹26,25,000 | |
| Tax on slab / flat income | ₹3,67,500 | |
| Tax on STCG (111A) | ₹0 | |
| Tax on LTCG (112 / 112A) | ₹46,875 | |
| Rebate (Sec 156) | ₹0 | |
| Surcharge after relief | ₹0 | |
| Cess | ₹16,575 | |
| **Total tax** | **₹4,30,950** | |
| TDS / TCS credit | ₹4,00,000 | |
| Net tax after credits | ₹30,950 | |
| Advance tax applicable? | Yes | |
| Cumulative due by 15 Jun / 15 Sep / 15 Dec / 15 Mar | ₹0 / ₹0 / ₹11,025 / ₹30,950 | |
| Sec 425 (234C) interest, installments already missed | ₹0 | |
| Sec 425 (234C) interest, upcoming if unpaid | ₹639 | |
| Sec 424 (234B) interest if balance paid Jul 2027 | ₹1,236 | |

Agree / Disagree: ______

## 5. Employer NPS above the 14% cap

Inputs: salary: ₹20,00,000, empNps: ₹5,00,000, tdsSalary: ₹2,50,000

| Item | MunVari | CA check |
|---|---:|---|
| Total income | ₹16,45,000 | |
| Income at slab / flat rate | ₹16,45,000 | |
| Tax on slab / flat income | ₹1,29,000 | |
| Tax on STCG (111A) | ₹0 | |
| Tax on LTCG (112 / 112A) | ₹0 | |
| Rebate (Sec 156) | ₹0 | |
| Surcharge after relief | ₹0 | |
| Cess | ₹5,160 | |
| **Total tax** | **₹1,34,160** | |
| TDS / TCS credit | ₹2,50,000 | |
| Net tax after credits | ₹0 | |
| Advance tax applicable? | No | |
| Cumulative due by 15 Jun / 15 Sep / 15 Dec / 15 Mar | ₹0 / ₹0 / ₹0 / ₹0 | |
| Sec 425 (234C) interest, installments already missed | ₹0 | |
| Sec 425 (234C) interest, upcoming if unpaid | ₹0 | |
| Sec 424 (234B) interest if balance paid Jul 2027 | ₹0 | |

Agree / Disagree: ______

## 6. STCG with current-year short-term loss and brought-forward LTCL

Inputs: salary: ₹15,00,000, tdsSalary: ₹1,20,000, stcgEq: ₹3,00,000, stLoss: ₹1,00,000, ltcgEq: ₹4,00,000, bfLtLoss: ₹1,50,000

| Item | MunVari | CA check |
|---|---:|---|
| Total income | ₹18,75,000 | |
| Income at slab / flat rate | ₹14,25,000 | |
| Tax on slab / flat income | ₹93,750 | |
| Tax on STCG (111A) | ₹40,000 | |
| Tax on LTCG (112 / 112A) | ₹15,625 | |
| Rebate (Sec 156) | ₹0 | |
| Surcharge after relief | ₹0 | |
| Cess | ₹5,975 | |
| **Total tax** | **₹1,55,350** | |
| TDS / TCS credit | ₹1,20,000 | |
| Net tax after credits | ₹35,350 | |
| Advance tax applicable? | Yes | |
| Cumulative due by 15 Jun / 15 Sep / 15 Dec / 15 Mar | ₹0 / ₹0 / ₹8,963 / ₹35,350 | |
| Sec 425 (234C) interest, installments already missed | ₹0 | |
| Sec 425 (234C) interest, upcoming if unpaid | ₹620 | |
| Sec 424 (234B) interest if balance paid Jul 2027 | ₹1,412 | |

Agree / Disagree: ______

## 7. Freelancer, presumptive Sec 58 (old 44ADA) at 50%

Inputs: bizType: 44ada, bizReceipts: ₹40,00,000, bizPct: ₹50, tdsBiz: ₹4,00,000

| Item | MunVari | CA check |
|---|---:|---|
| Total income | ₹20,00,000 | |
| Income at slab / flat rate | ₹20,00,000 | |
| Tax on slab / flat income | ₹2,00,000 | |
| Tax on STCG (111A) | ₹0 | |
| Tax on LTCG (112 / 112A) | ₹0 | |
| Rebate (Sec 156) | ₹0 | |
| Surcharge after relief | ₹0 | |
| Cess | ₹8,000 | |
| **Total tax** | **₹2,08,000** | |
| TDS / TCS credit | ₹4,00,000 | |
| Net tax after credits | ₹0 | |
| Advance tax applicable? | No | |
| Cumulative due by 15 Jun / 15 Sep / 15 Dec / 15 Mar | ₹0 / ₹0 / ₹0 / ₹0 | |
| Sec 425 (234C) interest, installments already missed | ₹0 | |
| Sec 425 (234C) interest, upcoming if unpaid | ₹0 | |
| Sec 424 (234B) interest if balance paid Jul 2027 | ₹0 | |

Agree / Disagree: ______

## 8. Resident senior, interest income only (exempt from advance tax)

Inputs: age: s60, fdInt: ₹20,00,000, regime: old

| Item | MunVari | CA check |
|---|---:|---|
| Total income | ₹19,50,000 | |
| Income at slab / flat rate | ₹19,50,000 | |
| Tax on slab / flat income | ₹3,95,000 | |
| Tax on STCG (111A) | ₹0 | |
| Tax on LTCG (112 / 112A) | ₹0 | |
| Rebate (Sec 156) | ₹0 | |
| Surcharge after relief | ₹0 | |
| Cess | ₹15,800 | |
| **Total tax** | **₹4,10,800** | |
| TDS / TCS credit | ₹0 | |
| Net tax after credits | ₹4,10,800 | |
| Advance tax applicable? | No (senior exemption) | |
| Cumulative due by 15 Jun / 15 Sep / 15 Dec / 15 Mar | ₹61,620 / ₹1,84,860 / ₹3,08,100 / ₹4,10,800 | |
| Sec 425 (234C) interest, installments already missed | ₹0 | |
| Sec 425 (234C) interest, upcoming if unpaid | ₹0 | |
| Sec 424 (234B) interest if balance paid Jul 2027 | ₹0 | |

Agree / Disagree: ______

## 9. High earner just over ₹50L (surcharge marginal relief)

Inputs: otherInc: ₹51,00,000

| Item | MunVari | CA check |
|---|---:|---|
| Total income | ₹51,00,000 | |
| Income at slab / flat rate | ₹51,00,000 | |
| Tax on slab / flat income | ₹11,10,000 | |
| Tax on STCG (111A) | ₹0 | |
| Tax on LTCG (112 / 112A) | ₹0 | |
| Rebate (Sec 156) | ₹0 | |
| Surcharge after relief | ₹70,000 (relief ₹41,000) | |
| Cess | ₹47,200 | |
| **Total tax** | **₹12,27,200** | |
| TDS / TCS credit | ₹0 | |
| Net tax after credits | ₹12,27,200 | |
| Advance tax applicable? | Yes | |
| Cumulative due by 15 Jun / 15 Sep / 15 Dec / 15 Mar | ₹1,84,080 / ₹5,52,240 / ₹9,20,400 / ₹12,27,200 | |
| Sec 425 (234C) interest, installments already missed | ₹22,086 | |
| Sec 425 (234C) interest, upcoming if unpaid | ₹39,884 | |
| Sec 424 (234B) interest if balance paid Jul 2027 | ₹49,088 | |

Agree / Disagree: ______

## 10. HUF with rent and interest

Inputs: entity: huf, rent: ₹9,00,000, muniTax: ₹20,000, fdInt: ₹4,00,000

| Item | MunVari | CA check |
|---|---:|---|
| Total income | ₹10,16,000 | |
| Income at slab / flat rate | ₹10,16,000 | |
| Tax on slab / flat income | ₹41,600 | |
| Tax on STCG (111A) | ₹0 | |
| Tax on LTCG (112 / 112A) | ₹0 | |
| Rebate (Sec 156) | ₹0 | |
| Surcharge after relief | ₹0 | |
| Cess | ₹1,664 | |
| **Total tax** | **₹43,264** | |
| TDS / TCS credit | ₹0 | |
| Net tax after credits | ₹43,264 | |
| Advance tax applicable? | Yes | |
| Cumulative due by 15 Jun / 15 Sep / 15 Dec / 15 Mar | ₹6,490 / ₹19,469 / ₹32,448 / ₹43,264 | |
| Sec 425 (234C) interest, installments already missed | ₹774 | |
| Sec 425 (234C) interest, upcoming if unpaid | ₹1,404 | |
| Sec 424 (234B) interest if balance paid Jul 2027 | ₹1,728 | |

Agree / Disagree: ______

## 11. Partnership firm, net profit ₹1.01 crore (12% surcharge, marginal relief)

Inputs: entity: firm, bizType: reg, bizProfit: ₹1,01,00,000

| Item | MunVari | CA check |
|---|---:|---|
| Total income | ₹1,01,00,000 | |
| Income at slab / flat rate | ₹1,01,00,000 | |
| Tax on slab / flat income | ₹30,30,000 | |
| Tax on STCG (111A) | ₹0 | |
| Tax on LTCG (112 / 112A) | ₹0 | |
| Rebate (Sec 156) | ₹0 | |
| Surcharge after relief | ₹70,000 (relief ₹2,93,600) | |
| Cess | ₹1,24,000 | |
| **Total tax** | **₹32,24,000** | |
| TDS / TCS credit | ₹0 | |
| Net tax after credits | ₹32,24,000 | |
| Advance tax applicable? | Yes | |
| Cumulative due by 15 Jun / 15 Sep / 15 Dec / 15 Mar | ₹4,83,600 / ₹14,50,800 / ₹24,18,000 / ₹32,24,000 | |
| Sec 425 (234C) interest, installments already missed | ₹58,032 | |
| Sec 425 (234C) interest, upcoming if unpaid | ₹1,04,780 | |
| Sec 424 (234B) interest if balance paid Jul 2027 | ₹1,28,960 | |

Agree / Disagree: ______

## 12. Non-resident with Indian rent and equity STCG

Inputs: resident: nr, rent: ₹12,00,000, stcgEq: ₹2,00,000, tdsRent: ₹3,50,000

| Item | MunVari | CA check |
|---|---:|---|
| Total income | ₹10,40,000 | |
| Income at slab / flat rate | ₹8,40,000 | |
| Tax on slab / flat income | ₹24,000 | |
| Tax on STCG (111A) | ₹40,000 | |
| Tax on LTCG (112 / 112A) | ₹0 | |
| Rebate (Sec 156) | ₹0 | |
| Surcharge after relief | ₹0 | |
| Cess | ₹2,560 | |
| **Total tax** | **₹66,560** | |
| TDS / TCS credit | ₹3,50,000 | |
| Net tax after credits | ₹0 | |
| Advance tax applicable? | No | |
| Cumulative due by 15 Jun / 15 Sep / 15 Dec / 15 Mar | ₹0 / ₹0 / ₹0 / ₹0 | |
| Sec 425 (234C) interest, installments already missed | ₹0 | |
| Sec 425 (234C) interest, upcoming if unpaid | ₹0 | |
| Sec 424 (234B) interest if balance paid Jul 2027 | ₹0 | |

Agree / Disagree: ______

---

Reviewed by: ____________________  CA membership no.: __________  Date: __________
