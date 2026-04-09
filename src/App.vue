<template>
  <div id="app">
    <MtgCalc />
  </div>
</template>

<script>
import MtgCalc from './components/MtgCalc.vue'

export default {
  name: 'App',
  components: {
    MtgCalc,
  },
}
</script>

<style>
body {
  margin: 0;
  background: #f4f7fb;
}

* {
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1f2937;
  padding: 24px 16px 48px;
}
</style>
