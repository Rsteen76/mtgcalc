import { describe, expect, it } from 'vitest'
import { calculateMortgageScenario, getMinimumDownPercent } from '../src/lib/mortgage.js'

describe('getMinimumDownPercent', () => {
  it('returns the expected floor by loan type', () => {
    expect(getMinimumDownPercent('conv')).toBe(3)
    expect(getMinimumDownPercent('fha')).toBe(3.5)
    expect(getMinimumDownPercent('va')).toBe(0)
    expect(getMinimumDownPercent('usda')).toBe(0)
  })
})

describe('calculateMortgageScenario', () => {
  it('calculates a conventional payment with MI and escrow', () => {
    const result = calculateMortgageScenario({
      purchasePrice: 450000,
      downPaymentPercent: 5,
      interestRate: 6.5,
      loanTermYears: 30,
      annualPropertyTax: 4200,
      annualHomeInsurance: 1400,
      monthlyHoa: 0,
      loanType: 'conv',
      includeMortgageInsurance: true,
    })

    expect(result.loanAmount).toBe(427500)
    expect(result.loanToValuePercent).toBeCloseTo(95, 5)
    expect(result.monthlyPrincipalAndInterest).toBe(2702.09)
    expect(result.monthlyMortgageInsurance).toBe(235.13)
    expect(result.totalMonthlyPayment).toBe(3403.88)
  })

  it('disables mortgage insurance when requested', () => {
    const result = calculateMortgageScenario({
      purchasePrice: 300000,
      downPaymentPercent: 20,
      interestRate: 6,
      loanTermYears: 30,
      annualPropertyTax: 3600,
      annualHomeInsurance: 1200,
      monthlyHoa: 50,
      loanType: 'conv',
      includeMortgageInsurance: false,
    })

    expect(result.monthlyMortgageInsurance).toBe(0)
    expect(result.totalMonthlyPayment).toBe(1888.92)
  })
})
