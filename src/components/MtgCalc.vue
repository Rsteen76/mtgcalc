<template>
  <div class="container">
    <h1>Mortgage Calculator</h1>
    <div class="row">
      <div class="col-md-12">
        <VueSlideBar min="100000" max="500000" label='Purchase Price' @sliderChanged="purchasePrice = $event" />
      </div>
      <div class="col-md-12">
        <VueSlideBar min="100000" max="500000" label='Down Payment Amount' @sliderChanged="downPayment = $event" />
        <h1>Loan Amount {{purchasePrice - downPayment}}</h1>
      </div>
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
        downPayment: ''
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