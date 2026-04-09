# mtgcalc

A modern mortgage scenario planner for quick payment estimates.

## Why this repo exists

This project is intentionally small, but it is not a throwaway demo. It focuses on one job and does it cleanly:

- compare **Conventional, FHA, VA, and USDA** scenarios
- estimate **principal + interest**
- include **mortgage insurance**, **property tax**, **homeowners insurance**, and **HOA**
- expose the calculation logic in a testable utility module
- stay light enough to deploy as a static app

## Stack

- Vue 3
- Vite
- Vitest

## Project structure

```text
src/
  components/MortgageCalculator.vue   # UI shell and inputs
  lib/mortgage.js                     # calculation engine
  style.css                           # app styling
tests/
  mortgage.test.js                    # core payment math checks
```

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Tests

```bash
npm run test
```

## Assumptions

- Conventional MI is estimated from LTV bands and drops off at 80% LTV.
- FHA monthly MI is estimated at 0.80% to 0.85% depending on LTV.
- USDA annual fee is estimated at 0.50% of the base loan amount.
- This is a fast planning tool, not an underwriting engine or official fee worksheet.

## Repo standard

The goal here is simple: if someone opens the repo cold, it should read like current taste, not legacy scaffolding.
