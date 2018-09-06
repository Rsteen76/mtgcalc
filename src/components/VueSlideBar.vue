<template>
  <!-- Create input group with label -->
  <div class="form-group" style="width:auto;">
    <label class="font-weight-bold" for="houseValue">{{label}}</label>
    <div class="input-group input-group-lg mb-3 mx-auto" style="width:210px;">
      <!-- Subtract from sliderValue -->
      <div class="input-group-prepend">
        <button v-on:click="subtractValue" class="btn btn-outline-secondary">-</button>
      </div>
      <input type="text" class="form-control" id="houseValue" v-model='formattedValue' value= formattedValue>
      <!-- Add to sliderValue -->
      <div class="input-group-append">
        <button v-on:click="addValue" class="btn btn-outline-secondary">+</button>
      </div>
    </div>
      <!-- Slider -->
      <input type="range" :min="min" :max="max" :step="step" v-model="sliderValue" class="slider" id="myRange">
  </div>
</template>

<script>

  export default { 
    props: ['label', 'min', 'max', 'step'],
    data: function() {
      return {
      sliderValue: this.min,
      inputValue: this.min,
      formattedValue: this.min
    }
    },
    watch:{
      sliderValue: function() {
        if (this.sliderValue>100000) {
          this.formattedValue =  "$" + this.sliderValue.slice(0, 3) + "," + this.sliderValue.slice(3,8);
        } else {
          this.formattedValue = this.sliderValue;
        }
        this.$emit('sliderChanged', this.sliderValue);
      },
      formattedValue: function() {
        if (this.sliderValue>100000) {
          return this.sliderValue = this.formattedValue.replace(/[^a-zA-Z0-9]/g,'');
        } 
      }
    },
    methods:{
      addValue: function(){
        return this.sliderValue = (parseInt(this.sliderValue) + 500).toString();
      },

      subtractValue: function(){
        return this.sliderValue = (parseInt(this.sliderValue) - 500).toString();
      }
    }
  }
  
    
</script>

<style>
  h1{
    font-family:'Arial';
    text-align:center;
  }

  /* The slider itself */
  .slider {
      -webkit-appearance: none;  /*Override default CSS styles */
      width: 80%;
      height: 40px; /* Specified height */
      background: #d3d3d3; /* Grey background */
      outline: none;
      border-style: solid;
      border-color: black;
      border-radius: 5px;
      opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
      -webkit-transition: .2s; /* 0.2 seconds transition on hover */
      transition: opacity .2s;
  }

  /* Mouse-over effects */
  .slider:hover {
      opacity: 1; /* Fully shown on mouse-over */
  }

  /* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */ 
  .slider::-webkit-slider-thumb {
      -webkit-appearance: none; /* Override default look */
      width: 25px; /* Set a specific slider handle width */
      height: 50px; /* Slider handle height */
      background: #4CAF50; /* Green background */
      cursor: pointer; /* Cursor on hover */
      border-radius: 10px;
  }

  .slider::-moz-range-thumb {
      width: 25px; /* Set a specific slider handle width */
      height: 50px; /* Slider handle height */
      background: #4CAF50; /* Green background */
      cursor: pointer; /* Cursor on hover */
  }
  #houseValue{
    border-color: black;
    border-style: solid;
    border-width: 1px;
  }
</style>

