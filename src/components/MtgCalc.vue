<template>
  <div class="container">
    <h1>Mortgage Calculator</h1>
    <div class="row">
      <!-- Loan Selection -->
      <div class="col-md-12 mx-auto mb-3 mt-3">
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="conventional" name="loanType" class="custom-control-input">
          <label class="custom-control-label" for="conventional">Conventional</label>
        </div>
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="fha" name="loanType" class="custom-control-input">
          <label class="custom-control-label" for="fha">FHA</label>
        </div>
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="va" name="loanType" class="custom-control-input">
          <label class="custom-control-label" for="va">VA</label>
        </div>
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="usda" name="loanType" class="custom-control-input">
          <label class="custom-control-label" for="usda">USDA</label>
        </div>
      </div>
      <!-- Purchase Price -->
      <div class="col-md-12">
        <VueSlideBar min="100000" max="999999" step="1000" label='Purchase Price' @sliderChanged="purchasePrice = $event" />
      </div>
      <!-- Down Payment Amount, Select whether dollar amount or percentage -->
      <div class="col-md-12 mx-auto mb-3">
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="dollar" name="downType" class="custom-control-input" v-model="picked" value="dollar">
          <label class="custom-control-label" for="dollar">$</label>
        </div>
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="percent" name="downType" class="custom-control-input" v-model="picked" value="percent">
          <label class="custom-control-label" for="percent">%</label>
        </div>
      </div>
      <!-- If dollar amount for down payment is picked -->
      <template v-if="picked==='dollar'">
      <div class="col-md-12">
        <VueSlideBar min="0" max="999999" step="1000" label='Down Payment Amount' @sliderChanged="downPayment = $event" />
        <h1>Loan Amount {{purchasePrice - downPayment}}</h1>
      </div>
      </template>
      <!-- If a percentage for dollar amount is picked -->
      <template v-if="picked==='percent'">
      <div class="col-md-12">
        <VueSlideBar min="0" max="100" step="1" label='Percent Down' @sliderChanged="downPercent = $event" />
        <h1>Loan Amount {{purchasePrice-(purchasePrice * downPercent*.01)}}</h1>
      </div>
      </template>
    </div>
  </div>
</template>

<script>
  // import { eventBus } from '../main';
  import VueSlideBar from './VueSlideBar.vue';
  export default {
    data: function () {
      return {
        purchasePrice: '',
        downPayment: '',
        downPercent: '',
        picked: ''
      }
    },

    components: {
      VueSlideBar
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>