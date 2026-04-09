const minimumDownByType = {
  conv: 3,
  fha: 3.5,
  va: 0,
  usda: 0,
}

export function getMinimumDownPercent(loanType) {
  return minimumDownByType[loanType] ?? minimumDownByType.conv
}

export function calculateMortgageScenario({
  purchasePrice,
  downPaymentPercent,
  interestRate,
  loanTermYears,
  annualPropertyTax = 0,
  annualHomeInsurance = 0,
  monthlyHoa = 0,
  loanType = 'conv',
  includeMortgageInsurance = true,
}) {
  const safePurchasePrice = Math.max(Number(purchasePrice) || 0, 0)
  const minDownPercent = getMinimumDownPercent(loanType)
  const safeDownPaymentPercent = clampNumber(Number(downPaymentPercent), minDownPercent, 100)
  const downPaymentAmount = safePurchasePrice * (safeDownPaymentPercent / 100)
  const loanAmount = Math.max(safePurchasePrice - downPaymentAmount, 0)
  const loanToValuePercent = safePurchasePrice ? (loanAmount / safePurchasePrice) * 100 : 0
  const monthlyRate = Math.max(Number(interestRate) || 0, 0) / 100 / 12
  const totalMonths = Math.max(Number(loanTermYears) || 30, 1) * 12

  let monthlyPrincipalAndInterest = 0

  if (loanAmount > 0) {
    if (monthlyRate === 0) {
      monthlyPrincipalAndInterest = loanAmount / totalMonths
    } else {
      const growthFactor = Math.pow(1 + monthlyRate, totalMonths)
      monthlyPrincipalAndInterest = loanAmount * monthlyRate * (growthFactor / (growthFactor - 1))
    }
  }

  const monthlyMortgageInsurance = includeMortgageInsurance
    ? loanAmount * getMonthlyMortgageInsuranceRate(loanType, loanToValuePercent)
    : 0

  const monthlyPropertyTax = Math.max(Number(annualPropertyTax) || 0, 0) / 12
  const monthlyHomeInsurance = Math.max(Number(annualHomeInsurance) || 0, 0) / 12
  const safeMonthlyHoa = Math.max(Number(monthlyHoa) || 0, 0)

  const totalMonthlyPayment =
    monthlyPrincipalAndInterest +
    monthlyMortgageInsurance +
    monthlyPropertyTax +
    monthlyHomeInsurance +
    safeMonthlyHoa

  return {
    downPaymentAmount: roundMoney(downPaymentAmount),
    loanAmount: roundMoney(loanAmount),
    loanToValuePercent,
    monthlyPrincipalAndInterest: roundMoney(monthlyPrincipalAndInterest),
    monthlyMortgageInsurance: roundMoney(monthlyMortgageInsurance),
    monthlyPropertyTax: roundMoney(monthlyPropertyTax),
    monthlyHomeInsurance: roundMoney(monthlyHomeInsurance),
    monthlyHoa: roundMoney(safeMonthlyHoa),
    totalMonthlyPayment: roundMoney(totalMonthlyPayment),
  }
}

function getMonthlyMortgageInsuranceRate(loanType, loanToValuePercent) {
  if (loanType === 'conv') {
    if (loanToValuePercent > 95) return 0.0087 / 12
    if (loanToValuePercent > 90) return 0.0066 / 12
    if (loanToValuePercent > 85) return 0.0046 / 12
    if (loanToValuePercent > 80) return 0.0023 / 12
    return 0
  }

  if (loanType === 'fha') {
    return loanToValuePercent > 95 ? 0.0085 / 12 : 0.008 / 12
  }

  if (loanType === 'usda') {
    return 0.005 / 12
  }

  return 0
}

function clampNumber(value, min, max) {
  if (Number.isNaN(value)) {
    return min
  }

  return Math.min(max, Math.max(min, value))
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}
