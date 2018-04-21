<template>
  <div id="app">
    <FixedElements/>
    <Sidebar/>
    <div id="main">
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
    </div>
  </div>
</template>

<script>
  var queryString = require('query-string')
  var golos = require('golos-js');
  import FixedElements from './FixedElements.vue'
  import Sidebar from './Sidebar.vue'
  import Comments from './Comments.vue'
  import Upvotes from './Upvotes.vue'
  import {PlyrVideo} from 'vue-plyr'
  import {getVideoContent} from './getVideoContent.js'
  import {parseBody} from './parseBody.js'
  
  export default {
    name: 'app',
    
    components: {
      FixedElements,
      Sidebar,
      Comments,
      Upvotes,
      PlyrVideo
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
