<template>
  <div id="app">
    <Navigation/>
    <div id="main">
      <video-block
        :author="author"
        :permlink="permlink"
        :ap="true"
        :muted="false"
        :controls="true"
        :custom_player="true"
      />
      <Upvotes
        :author="author"
        :permlink="permlink"
      />
      <Comments id="comments"
                :author="author"
                :permlink="permlink"
      />
    </div>
  </div>
</template>

<script>
  var queryString = require('query-string')
  var golos = require('golos-js')
  import VideoBlock from './VideoBlock.vue'
  import Navigation from './Navigation.vue'
  import Category from './Category.vue'
  import Comments from './Comments.vue'
  import Upvotes from './Upvotes.vue'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'
  import BootstrapVue from 'bootstrap-vue'
  import Vue from 'vue'

  Vue.use(BootstrapVue);  

  export default {
    name: 'app',
    
    components: {
      Navigation,
      VideoBlock,
      Comments,
      Upvotes,
      Navigation,
    },
    
    data: function () {
      return {
        author: "",
        permlink: "",
      };
    },
    
    created: function () {
      var vm = this;
      var queries = queryString.parse(location.search);
      vm.author = queries.a;
      vm.permlink = queries.v;
    }
  }
</script>

<style>
  .plyr--video {
    width: 85%;
    margin-top: 3em; 
  }
  
  #app {
    padding-top: 4em;
  }
  
  #main {
    margin-left: 12.5em;
  }
  
  #comments {
    margin-top: 3em;
  }
  
  video {
    width: 100%;
    height: 80%;
  }
</style>
