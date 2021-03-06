<template>
  <div class="container">
    <h1>Mortgage Calculator</h1>
    <div class="row">
      <!-- Loan Selection -->
      <div class="col-auto mx-auto mb-3 mt-3">
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="conventional" name="loanType" v-model="loanType" value="conv" class="custom-control-input">
          <label class="custom-control-label" for="conventional">Conventional</label>
        </div>
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="fha" name="loanType" v-model="loanType" value="fha" class="custom-control-input">
          <label class="custom-control-label" for="fha">FHA</label>
        </div>
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="va" name="loanType" v-model="loanType" value="va" class="custom-control-input">
          <label class="custom-control-label" for="va">VA</label>
        </div>
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="usda" name="loanType" v-model="loanType" value="usda" class="custom-control-input">
          <label class="custom-control-label" for="usda">USDA</label>
        </div>
      </div>
      <!-- Purchase Price -->
      <div class="col-md-12">
        <VueSlideBar min="100000" max="999999" step="1000" increment="1000" label='Purchase Price' format='$' @change="purchasePrice = $event" />
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
      <template v-if="picked === 'dollar'">
      <div class="col-md-12">
        <VueSlideBar :min=minDownPayment :max=purchasePrice step="500" increment="500" label='Down Payment Amount' format='$' @change="downPayment = $event" />
      </div>
      </template>
      <!-- If a percentage for dollar amount is picked -->
      <template v-else-if="picked==='percent'" >
      <div class="col-md-12">
        <VueSlideBar :min=minDownPercent max="100" step="1" increment="1" label='Percent Down' @change="downPercent = $event" format='%' />
      </div>
      </template>
      <!-- Select Interest Rate -->
      <div class="col-md-12">
        <VueSlideBar min="1" max="10" step=".125" increment="0.125" label='Interest Rate' format="%" @change="interestRate = $event" />
      </div>
      <div class="col-md-12">
        <h2>Loan Amount ${{loanAmount}}</h2>
        <h2>Payment ${{payment}}</h2>
        <h2 v-if="mtgIns" > MI = ${{ mtgIns }}</h2>
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
        purchasePrice: '100000',
        downPayment: '',
        minDownPayment: '3000',
        minDownPercent: '',
        downPercent: '',
        picked: 'dollar',
        interestRate: '1',
        N: 30 * 12, //number of payments months
        minltv: '3',
        loanType: 'conv'
      }
    },

    components: {
      VueSlideBar
    },
    
    watch: {
      loanType: function() {
        if (this.loanType === 'conv') {
          return this.minltv ='3';
        } else if(this.loanType ==='fha') {
          return this.minltv = '3.5';
        } else {
          return this.minltv = "0";
        }
      },
    },
    computed: {
      ltv: function() {
        return ((parseFloat((this.loanAmount.toString()).replace(/[\D\s-]+/g, ""))/this.purchasePrice)*100).toFixed(0);
      },
      minDown: function () {
        return this.purchasePrice * .03;
      },
      // Calculate monthly interest amount
      I: function () {
        return parseFloat(this.interestRate) / 100 / 12;
      },
      // Calculate Loan Amount
      loanAmount: function() {
        if (this.picked==="percent") {
          return this.purchasePrice-(this.purchasePrice * this.downPercent*.01);
        } else if(this.picked==="dollar") {
          return (((this.purchasePrice-this.downPayment).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }
      },
      // Calculate Payment Amount
      payment: function() {
        return (parseFloat(((this.loanAmount.toString()).replace(/[^a-zA-Z0-9]/g, ''))) * this.I * (Math.pow(1 + this.I, this.N) / (Math.pow(1 + this.I, this.N) - 1))).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      mtgIns: function () {
        const strLoanAmount = this.loanAmount.toString()
        if(this.loanType === "va") {
          this.minDownPercent = 0
          this.minDownPayment = this.purchasePrice * (this.minDownPercent * .01)

        // USDA Loan
        } else if (this.loanType === "usda") {
          this.minDownPercent = 0
          this.minDownPayment = this.purchasePrice * (this.minDownPercent * .01)

          return (parseFloat(strLoanAmount.replace(/[\D\s-]+/g, "")) * .005 /12).toFixed(2);
        // FHA loan
        } else if(this.loanType === "fha") {
          this.minDownPercent = 3.5
          this.minDownPayment = this.purchasePrice * (this.minDownPercent * .01)

          if (this.ltv > 95) {
            return (parseFloat(strLoanAmount.replace(/[\D\s-]+/g, "")) * .0085 /12).toFixed(2);
          } else if (this.ltv > 0 && this.ltv < 96.5) {
            return (parseFloat(strLoanAmount.replace(/[\D\s-]+/g, "")) * .008 /12).toFixed(2);
          }
        // Conventional Loan
        } else if(this.loanType === "conv") {
          this.minDownPercent = 3
          this.minDownPayment = this.purchasePrice * (this.minDownPercent * .01)

          if(this.ltv >= 95 && this.ltv <= 97) {
            return (parseFloat(strLoanAmount.replace(/[\D\s-]+/g, "")) * .0087  /12).toFixed(2);
          } else if(this.ltv > 90 && this.ltv <= 95) {
            return (parseFloat(strLoanAmount.replace(/[\D\s-]+/g, "")) * .0066 /12).toFixed(2);
          } else if(this.ltv > 85 && this.ltv <= 90) {
            return (parseFloat(strLoanAmount.replace(/[\D\s-]+/g, "")) * .0046 /12).toFixed(2);
          } else if(this.ltv > 80 && this.ltv <= 85) {
            return (parseFloat(strLoanAmount.replace(/[\D\s-]+/g, "")) * .0023 /12).toFixed(2);
          }
        }
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    font-size: 30px;
  }

  @media (min-width:600px) {
    h1 {
      font-size: 30px;
    }
  }

  @media(min-width:800px) {
    h1 {
      font-size: 45px;
    }
  }
</style>