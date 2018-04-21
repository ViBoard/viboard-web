<template>
  
  <b-col cols=10 offset=2 class="bg-light" id="inner">
    <slot>

    </slot>
  </b-col>
</template>

<script>
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'
  import 'vue-plyr/dist/vue-plyr.css';
  import BootstrapVue from 'bootstrap-vue'
  import Vue from 'vue'
  Vue.use(BootstrapVue);  

  export default {
    name: 'AppInner',
  }

</script>

<style>
#inner {
  padding-top: 5em;
}
</style>
