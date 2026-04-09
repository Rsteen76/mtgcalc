<template>
  <div class="slide-bar">
    <div class="slide-bar__header">
      <label class="slide-bar__label" :for="inputId">{{ label }}</label>
      <span class="slide-bar__value">{{ displayValue }}</span>
    </div>

    <div class="slide-bar__controls">
      <button type="button" class="slide-bar__button" @click="adjustValue(-numericIncrement)">−</button>
      <input
        :id="inputId"
        type="range"
        class="slide-bar__range"
        :min="numericMin"
        :max="numericMax"
        :step="numericStep"
        :value="numericValue"
        @input="onInput"
      >
      <button type="button" class="slide-bar__button" @click="adjustValue(numericIncrement)">+</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    min: {
      type: [Number, String],
      required: true,
    },
    max: {
      type: [Number, String],
      required: true,
    },
    step: {
      type: [Number, String],
      default: 1,
    },
    increment: {
      type: [Number, String],
      default: 1,
    },
    format: {
      type: String,
      default: '',
    },
    value: {
      type: [Number, String],
      default: null,
    },
  },
  data() {
    return {
      localValue: this.initialValue,
    }
  },
  computed: {
    inputId() {
      return `slider-${this.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    },
    numericMin() {
      return Number(this.min)
    },
    numericMax() {
      return Number(this.max)
    },
    numericStep() {
      return Number(this.step)
    },
    numericIncrement() {
      return Number(this.increment)
    },
    initialValue() {
      const incoming = this.value === null || this.value === undefined || this.value === ''
        ? Number(this.min)
        : Number(this.value)
      return this.clamp(incoming)
    },
    numericValue() {
      return this.clamp(Number(this.localValue))
    },
    displayValue() {
      if (this.format === '$') {
        return this.formatCurrency(this.numericValue)
      }

      if (this.format === '%') {
        return `${this.numericValue}%`
      }

      return String(this.numericValue)
    },
  },
  watch: {
    value(nextValue) {
      if (nextValue === null || nextValue === undefined || nextValue === '') {
        return
      }

      this.localValue = this.clamp(Number(nextValue))
    },
  },
  mounted() {
    this.emitChange()
  },
  methods: {
    clamp(value) {
      if (Number.isNaN(value)) {
        return this.numericMin
      }

      return Math.min(this.numericMax, Math.max(this.numericMin, value))
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(value)
    },
    adjustValue(delta) {
      this.localValue = this.clamp(Number(this.localValue) + delta)
      this.emitChange()
    },
    onInput(event) {
      this.localValue = this.clamp(Number(event.target.value))
      this.emitChange()
    },
    emitChange() {
      this.$emit('change', this.numericValue)
    },
  },
}
</script>

<style scoped>
.slide-bar {
  background: #ffffff;
  border: 1px solid #dbe3ef;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.slide-bar__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 12px;
}

.slide-bar__label {
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.slide-bar__value {
  font-weight: 600;
  color: #2563eb;
}

.slide-bar__controls {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) 48px;
  gap: 12px;
  align-items: center;
}

.slide-bar__button {
  height: 44px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #f8fafc;
  color: #0f172a;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}

.slide-bar__button:hover {
  background: #eef2ff;
}

.slide-bar__range {
  width: 100%;
  appearance: none;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, #2563eb, #60a5fa);
  outline: none;
}

.slide-bar__range::-webkit-slider-thumb {
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  background: #0f172a;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.2);
  cursor: pointer;
}

.slide-bar__range::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  background: #0f172a;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.2);
  cursor: pointer;
}
</style>
