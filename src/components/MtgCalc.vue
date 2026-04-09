<template>
  <div class="calculator-shell">
    <section class="hero-card">
      <p class="eyebrow">Mortgage calculator</p>
      <h1>Estimate a payment fast</h1>
      <p class="hero-copy">
        Compare conventional, FHA, VA, and USDA scenarios with purchase price, down payment, and interest rate controls.
      </p>
    </section>

    <section class="calculator-grid">
      <div class="panel">
        <div class="field-block">
          <p class="section-label">Loan type</p>
          <div class="loan-type-grid">
            <label
              v-for="option in loanOptions"
              :key="option.value"
              class="loan-pill"
              :class="{ 'loan-pill--active': loanType === option.value }"
            >
              <input v-model="loanType" type="radio" name="loanType" :value="option.value">
              <span>{{ option.label }}</span>
            </label>
          </div>
          <p class="helper-text">Minimum down payment: {{ formatPercent(loanConfig.minDownPercent) }}</p>
        </div>

        <div class="slider-stack">
          <VueSlideBar
            label="Purchase Price"
            :min="100000"
            :max="1500000"
            :step="1000"
            :increment="5000"
            format="$"
            :value="purchasePrice"
            @change="purchasePrice = $event"
          />

          <div class="field-block">
            <p class="section-label">Down payment input</p>
            <div class="toggle-row">
              <button
                type="button"
                class="toggle-chip"
                :class="{ 'toggle-chip--active': downPaymentMode === 'dollar' }"
                @click="downPaymentMode = 'dollar'"
              >
                Dollar amount
              </button>
              <button
                type="button"
                class="toggle-chip"
                :class="{ 'toggle-chip--active': downPaymentMode === 'percent' }"
                @click="downPaymentMode = 'percent'"
              >
                Percent down
              </button>
            </div>
          </div>

          <VueSlideBar
            v-if="downPaymentMode === 'dollar'"
            label="Down Payment"
            :min="minimumDownPayment"
            :max="purchasePrice"
            :step="500"
            :increment="1000"
            format="$"
            :value="downPaymentAmount"
            @change="downPaymentAmount = $event"
          />

          <VueSlideBar
            v-else
            label="Percent Down"
            :min="loanConfig.minDownPercent"
            :max="50"
            :step="0.5"
            :increment="1"
            format="%"
            :value="downPaymentPercent"
            @change="downPaymentPercent = $event"
          />

          <VueSlideBar
            label="Interest Rate"
            :min="1"
            :max="10"
            :step="0.125"
            :increment="0.125"
            format="%"
            :value="interestRate"
            @change="interestRate = $event"
          />
        </div>
      </div>

      <aside class="summary-card">
        <h2>Estimate</h2>

        <div class="summary-row">
          <span>Purchase price</span>
          <strong>{{ formatCurrency(purchasePrice) }}</strong>
        </div>
        <div class="summary-row">
          <span>Down payment</span>
          <strong>{{ formatCurrency(effectiveDownPayment) }} ({{ formatPercent(effectiveDownPercent) }})</strong>
        </div>
        <div class="summary-row">
          <span>Base loan amount</span>
          <strong>{{ formatCurrency(loanAmount) }}</strong>
        </div>
        <div class="summary-row">
          <span>Interest rate</span>
          <strong>{{ formatPercent(interestRate) }}</strong>
        </div>
        <div class="summary-row">
          <span>Principal + interest</span>
          <strong>{{ formatCurrency(monthlyPrincipalAndInterest) }}</strong>
        </div>
        <div class="summary-row" v-if="monthlyMortgageInsurance > 0">
          <span>Estimated monthly MI</span>
          <strong>{{ formatCurrency(monthlyMortgageInsurance) }}</strong>
        </div>

        <div class="payment-total">
          <span>Estimated monthly payment</span>
          <strong>{{ formatCurrency(totalMonthlyPayment) }}</strong>
        </div>

        <div class="disclaimer">
          <p>
            For quick comparison only. Taxes, homeowners insurance, HOA dues, and loan-specific fees are not included.
          </p>
        </div>
      </aside>
    </section>
  </div>
</template>

<script>
import VueSlideBar from './VueSlideBar.vue'

export default {
  components: {
    VueSlideBar,
  },
  data() {
    return {
      purchasePrice: 450000,
      downPaymentAmount: 13500,
      downPaymentPercent: 3,
      downPaymentMode: 'dollar',
      interestRate: 6.5,
      loanTermMonths: 360,
      loanType: 'conv',
      loanOptions: [
        { label: 'Conventional', value: 'conv' },
        { label: 'FHA', value: 'fha' },
        { label: 'VA', value: 'va' },
        { label: 'USDA', value: 'usda' },
      ],
    }
  },
  computed: {
    loanConfig() {
      const configs = {
        conv: { minDownPercent: 3, monthlyMIRate: this.conventionalMIRate },
        fha: { minDownPercent: 3.5, monthlyMIRate: this.fhaMIRate },
        va: { minDownPercent: 0, monthlyMIRate: 0 },
        usda: { minDownPercent: 0, monthlyMIRate: 0.005 / 12 },
      }

      return configs[this.loanType]
    },
    minimumDownPayment() {
      return this.purchasePrice * (this.loanConfig.minDownPercent / 100)
    },
    effectiveDownPercent() {
      if (this.downPaymentMode === 'percent') {
        return Math.max(this.loanConfig.minDownPercent, Number(this.downPaymentPercent))
      }

      return (this.effectiveDownPayment / this.purchasePrice) * 100
    },
    effectiveDownPayment() {
      if (this.downPaymentMode === 'percent') {
        return this.purchasePrice * (this.effectiveDownPercent / 100)
      }

      return this.clampCurrency(this.downPaymentAmount, this.minimumDownPayment, this.purchasePrice)
    },
    loanAmount() {
      return Math.max(0, this.purchasePrice - this.effectiveDownPayment)
    },
    loanToValue() {
      if (!this.purchasePrice) {
        return 0
      }

      return (this.loanAmount / this.purchasePrice) * 100
    },
    monthlyRate() {
      return Number(this.interestRate) / 100 / 12
    },
    monthlyPrincipalAndInterest() {
      if (this.monthlyRate === 0) {
        return this.loanAmount / this.loanTermMonths
      }

      const growth = Math.pow(1 + this.monthlyRate, this.loanTermMonths)
      return this.loanAmount * this.monthlyRate * (growth / (growth - 1))
    },
    conventionalMIRate() {
      if (this.loanToValue >= 95 && this.loanToValue <= 97) return 0.0087 / 12
      if (this.loanToValue > 90) return 0.0066 / 12
      if (this.loanToValue > 85) return 0.0046 / 12
      if (this.loanToValue > 80) return 0.0023 / 12
      return 0
    },
    fhaMIRate() {
      if (this.loanToValue > 95) return 0.0085 / 12
      if (this.loanToValue > 0) return 0.008 / 12
      return 0
    },
    monthlyMortgageInsurance() {
      return this.loanAmount * this.loanConfig.monthlyMIRate
    },
    totalMonthlyPayment() {
      return this.monthlyPrincipalAndInterest + this.monthlyMortgageInsurance
    },
  },
  watch: {
    loanType() {
      if (this.downPaymentMode === 'percent') {
        this.downPaymentPercent = Math.max(this.downPaymentPercent, this.loanConfig.minDownPercent)
      } else {
        this.downPaymentAmount = this.clampCurrency(this.downPaymentAmount, this.minimumDownPayment, this.purchasePrice)
      }
    },
    purchasePrice() {
      if (this.downPaymentMode === 'percent') {
        this.downPaymentPercent = Math.max(this.downPaymentPercent, this.loanConfig.minDownPercent)
      } else {
        this.downPaymentAmount = this.clampCurrency(this.downPaymentAmount, this.minimumDownPayment, this.purchasePrice)
      }
    },
    downPaymentMode(nextMode) {
      if (nextMode === 'percent') {
        this.downPaymentPercent = Math.max(this.effectiveDownPercent, this.loanConfig.minDownPercent)
      } else {
        this.downPaymentAmount = this.effectiveDownPayment
      }
    },
  },
  methods: {
    clampCurrency(value, min, max) {
      const numericValue = Number(value)
      return Math.min(max, Math.max(min, numericValue))
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(value)
    },
    formatPercent(value) {
      return `${Number(value).toFixed(1).replace(/\.0$/, '')}%`
    },
  },
}
</script>

<style scoped>
.calculator-shell {
  max-width: 1120px;
  margin: 0 auto;
}

.hero-card {
  background: linear-gradient(135deg, #0f172a, #1d4ed8);
  color: #ffffff;
  border-radius: 22px;
  padding: 28px;
  margin-bottom: 24px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.18);
}

.eyebrow {
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 12px;
  opacity: 0.8;
}

.hero-card h1 {
  margin: 0 0 10px;
  font-size: 36px;
  line-height: 1.05;
}

.hero-copy {
  margin: 0;
  max-width: 720px;
  font-size: 17px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.88);
}

.calculator-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.9fr);
  gap: 24px;
}

.panel,
.summary-card {
  background: #ffffff;
  border-radius: 22px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
}

.slider-stack {
  display: grid;
  gap: 16px;
}

.field-block {
  margin-bottom: 20px;
}

.section-label {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #475569;
  margin: 0 0 10px;
}

.helper-text {
  margin: 10px 0 0;
  color: #64748b;
  font-size: 14px;
}

.loan-type-grid,
.toggle-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.loan-pill,
.toggle-chip {
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  padding: 10px 14px;
  background: #f8fafc;
  color: #0f172a;
  font-weight: 600;
  cursor: pointer;
}

.loan-pill input {
  display: none;
}

.loan-pill--active,
.toggle-chip--active {
  background: #dbeafe;
  border-color: #60a5fa;
  color: #1d4ed8;
}

.toggle-chip {
  appearance: none;
}

.summary-card h2 {
  margin-top: 0;
  margin-bottom: 18px;
  font-size: 28px;
}

.summary-row,
.payment-total {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: baseline;
}

.summary-row {
  padding: 14px 0;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
}

.summary-row strong,
.payment-total strong {
  color: #0f172a;
}

.payment-total {
  margin-top: 18px;
  padding: 18px;
  border-radius: 16px;
  background: #eff6ff;
  color: #1e3a8a;
  font-size: 18px;
}

.disclaimer {
  margin-top: 18px;
  font-size: 13px;
  line-height: 1.5;
  color: #64748b;
}

@media (max-width: 900px) {
  .calculator-grid {
    grid-template-columns: 1fr;
  }

  .hero-card h1 {
    font-size: 30px;
  }
}
</style>
