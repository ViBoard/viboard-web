<template>
  <div id="app">
    <Navigation/>
    <AppInner>
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
    </AppInner>
  </div>
</template>

<script>
  var queryString = require('query-string')
  var golos = require('golos-js')
  import AppInner from './AppInner.vue'
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
      AppInner,
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
    width: 70%;
  }
  
  #comments {
    margin-top: 3em;
  }
  
  video {
    width: 100%;
    height: 80%;
  }
</style>
