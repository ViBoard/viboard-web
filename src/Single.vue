<template>
  <div id="app">
   <Navigation/>
    <AppInner>
      <plyr-video :poster="previewSrc"
                  :videos="this.videos"
                  :autoplay="ap"
                  :muted="muted"
                  :controls="customControls"
                  :crossorigin="true"/>

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
  var golos = require('golos-js');
  import Comments from './Comments.vue'
  import Upvotes from './Upvotes.vue'
  import {PlyrVideo} from 'vue-plyr'
  import {getVideoContent} from './getVideoContent.js'
  import {parseBody} from './parseBody.js'
  
  import AppInner from './AppInner.vue'
  import VideoBlock from './VideoBlock.vue'
  import Navigation from './Navigation.vue'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'
  import BootstrapVue from 'bootstrap-vue'
  import Vue from 'vue'

  Vue.use(BootstrapVue);

  export default {
    name: 'app',
    
    components: {
      Comments,
      Upvotes,
      PlyrVideo,
      VideoBlock,
      Navigation,
      AppInner,
    },
    
    mixins: [parseBody, getVideoContent],
    
    data: function () {
      return {
        author: "",
        permlink: "",
        src: "",
        previewSrc: "",
        title: "",
        total: "",
        videos: [],
        customControls: ``,
        
        
        ap: false,
        muted: false,
        controls: true,
      };
    },
    
    computed: {
      getHref: function () {
        return 'watch?v=' + this.permlink + '&a=' + this.author
      }
    },
    
    created: function () {
      let vm = this;
      let queries = queryString.parse(location.search);
      vm.author = queries.a;
      vm.permlink = queries.v;
      vm.getVideoContent(vm);
      console.log(vm.src, vm.ap)
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
