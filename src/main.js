import Vue from 'vue'

import BootstrapVue from 'bootstrap-vue'

import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css'

import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.use(BootstrapVue);

Vue.config.productionTip = false

export const eventBus = new Vue({
  methods: {
    changeValue(value) {
      this.$emit('valueChanged', value);
    }
  }
});
new Vue({
  render: h => h(App)
}).$mount('#app')
