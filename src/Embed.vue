<template>
  <div id="app">
    <plyr-video :poster="previewSrc"
                :videos="this.videos"
                :options="{title: 'aaaa'}"
                :crosorigin="true"/>
        <b-button variant="link" id="link" :href="getHref" target="_blank"> <img id="link-img" src="./assets/logo-wide.png"/> </b-button>
  </div>
</template>

<script>
  var queryString = require('query-string')
  var golos = require('golos-js');

  import {PlyrVideo} from 'vue-plyr'
  import {getVideoContent} from './getVideoContent.js'
  import {parseBody} from './parseBody.js'

  export default {
    name: 'app',

    components: {
      PlyrVideo,
    },

    mixins: [parseBody, getVideoContent],

    data: function() {
      return {
        author: "",
        permlink: "",
        src: "",
        previewSrc: "",
        videos: [],
      }
    },

    computed: {
        getHref: function () {
            return 'watch?v=' + this.permlink + '&a=' + this.author
        },
    },

    created: function() {
      let vm = this;
      let queries = queryString.parse(location.search);
      vm.author = queries.a;
      vm.permlink = queries.v;
      vm.getVideoContent(vm);
    }
  }

</script>


<style>
#link {
  position: absolute;
  top: 1em;
  right: 1.5em;
  padding: 0.3em;
  border-radius: 3px;
}

#link-img {
   max-height: 1.2em;
   -webkit-filter: invert(100%) !important;
   filter: invert(100%) !important;
}

#app {
    max-width: 600px;
}
</style>
