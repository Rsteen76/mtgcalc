<template>
  <div id="app">
    <mtg-calc></mtg-calc>
    
  </div>
</template>

<script>
import VueSlideBar from './components/VueSlideBar.vue'
import MtgCalc from './components/MtgCalc.vue'


export default {
  name: 'app',
  components: {
    MtgCalc,
    VueSlideBar,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 15px;
}
</style>
