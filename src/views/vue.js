import Vue from 'vue';
import App from './index.vue';

new Vue({
  el: '#app',
  render: (createElement) => {
    return createElement(App);
  }
});
