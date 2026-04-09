<template>
  <main class="shell">
    <section class="hero card">
      <div>
        <p class="eyebrow">Mortgage scenario planner</p>
        <h1>Fast payment math that still feels production-grade.</h1>
        <p class="lede">
          Compare conventional, FHA, VA, and USDA scenarios with adjustable purchase price, down payment,
          rate, taxes, insurance, HOA, and loan term assumptions.
        </p>
      </div>
      <div class="hero-stat">
        <span class="hero-stat__label">Estimated monthly payment</span>
        <strong>{{ formatCurrency(scenario.totalMonthlyPayment) }}</strong>
        <small>P&I + MI + taxes + insurance + HOA</small>
      </div>
    </section>

    <section class="content-grid">
      <section class="card controls">
        <div class="section-heading">
          <h2>Scenario inputs</h2>
          <p>Small enough to scan fast, rich enough to be useful.</p>
        </div>

        <div class="control-group">
          <label class="field-label">Loan program</label>
          <div class="pill-grid">
            <button
              v-for="option in loanOptions"
              :key="option.value"
              type="button"
              class="pill"
              :class="{ 'pill--active': state.loanType === option.value }"
              @click="state.loanType = option.value"
            >
              {{ option.label }}
            </button>
          </div>
          <p class="hint">Minimum down payment: {{ formatPercent(minimumDownPercent) }}</p>
        </div>

        <div class="control-grid">
          <label>
            <span class="field-label">Purchase price</span>
            <input v-model.number="state.purchasePrice" type="number" min="50000" step="1000">
          </label>

          <label>
            <span class="field-label">Interest rate (%)</span>
            <input v-model.number="state.interestRate" type="number" min="0" max="15" step="0.125">
          </label>

          <label>
            <span class="field-label">Down payment (%)</span>
            <input v-model.number="state.downPaymentPercent" type="number" :min="minimumDownPercent" max="60" step="0.5">
          </label>

          <label>
            <span class="field-label">Loan term</span>
            <select v-model.number="state.loanTermYears">
              <option :value="30">30 years</option>
              <option :value="20">20 years</option>
              <option :value="15">15 years</option>
              <option :value="10">10 years</option>
            </select>
          </label>

          <label>
            <span class="field-label">Annual property tax</span>
            <input v-model.number="state.annualPropertyTax" type="number" min="0" step="100">
          </label>

          <label>
            <span class="field-label">Annual homeowners insurance</span>
            <input v-model.number="state.annualHomeInsurance" type="number" min="0" step="50">
          </label>

          <label>
            <span class="field-label">Monthly HOA</span>
            <input v-model.number="state.monthlyHoa" type="number" min="0" step="25">
          </label>

          <label>
            <span class="field-label">MI profile</span>
            <select v-model="state.mortgageInsuranceMode">
              <option value="standard">Standard estimate</option>
              <option value="none">None</option>
            </select>
          </label>
        </div>
      </section>

      <aside class="card summary">
        <div class="section-heading">
          <h2>Payment summary</h2>
          <p>Clean output and assumptions you can explain.</p>
        </div>

        <div class="summary-list">
          <div class="summary-row">
            <span>Purchase price</span>
            <strong>{{ formatCurrency(state.purchasePrice) }}</strong>
          </div>
          <div class="summary-row">
            <span>Down payment</span>
            <strong>{{ formatCurrency(scenario.downPaymentAmount) }} ({{ formatPercent(state.downPaymentPercent) }})</strong>
          </div>
          <div class="summary-row">
            <span>Loan amount</span>
            <strong>{{ formatCurrency(scenario.loanAmount) }}</strong>
          </div>
          <div class="summary-row">
            <span>Loan-to-value</span>
            <strong>{{ formatPercent(scenario.loanToValuePercent) }}</strong>
          </div>
          <div class="summary-row">
            <span>Principal + interest</span>
            <strong>{{ formatCurrency(scenario.monthlyPrincipalAndInterest) }}</strong>
          </div>
          <div class="summary-row">
            <span>Mortgage insurance</span>
            <strong>{{ formatCurrency(scenario.monthlyMortgageInsurance) }}</strong>
          </div>
          <div class="summary-row">
            <span>Property tax</span>
            <strong>{{ formatCurrency(scenario.monthlyPropertyTax) }}</strong>
          </div>
          <div class="summary-row">
            <span>Homeowners insurance</span>
            <strong>{{ formatCurrency(scenario.monthlyHomeInsurance) }}</strong>
          </div>
          <div class="summary-row">
            <span>HOA</span>
            <strong>{{ formatCurrency(scenario.monthlyHoa) }}</strong>
          </div>
        </div>

        <div class="total-box">
          <span>Total estimated monthly payment</span>
          <strong>{{ formatCurrency(scenario.totalMonthlyPayment) }}</strong>
        </div>

        <div class="assumption-box">
          <h3>Assumptions</h3>
          <ul>
            <li>USDA annual fee estimated at 0.50% of the loan, billed monthly.</li>
            <li>FHA monthly MI estimated at 0.80% to 0.85%, depending on LTV.</li>
            <li>Conventional MI ramps down as LTV improves and falls off at 80% LTV.</li>
            <li>This is for fast planning, not underwriting or a fee worksheet.</li>
          </ul>
        </div>
      </aside>
    </section>
  </main>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { calculateMortgageScenario, getMinimumDownPercent } from '../lib/mortgage.js'

const loanOptions = [
  { label: 'Conventional', value: 'conv' },
  { label: 'FHA', value: 'fha' },
  { label: 'VA', value: 'va' },
  { label: 'USDA', value: 'usda' },
]

const state = reactive({
  purchasePrice: 450000,
  downPaymentPercent: 5,
  interestRate: 6.5,
  loanTermYears: 30,
  annualPropertyTax: 4200,
  annualHomeInsurance: 1400,
  monthlyHoa: 0,
  mortgageInsuranceMode: 'standard',
  loanType: 'conv',
})

const minimumDownPercent = computed(() => getMinimumDownPercent(state.loanType))

watch(
  () => state.loanType,
  () => {
    if (state.downPaymentPercent < minimumDownPercent.value) {
      state.downPaymentPercent = minimumDownPercent.value
    }
  },
  { immediate: true },
)

const scenario = computed(() =>
  calculateMortgageScenario({
    purchasePrice: state.purchasePrice,
    downPaymentPercent: state.downPaymentPercent,
    interestRate: state.interestRate,
    loanTermYears: state.loanTermYears,
    annualPropertyTax: state.annualPropertyTax,
    annualHomeInsurance: state.annualHomeInsurance,
    monthlyHoa: state.monthlyHoa,
    loanType: state.loanType,
    includeMortgageInsurance: state.mortgageInsuranceMode !== 'none',
  }),
)

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercent(value) {
  return `${Number(value).toFixed(1).replace(/\.0$/, '')}%`
}
</script>
