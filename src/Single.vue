<template>
  <div id="app">
    <FixedElements/>
    <Sidebar/>
    <div id="main">
    <video-block :video="video"
           :ap="true"
           :muted="false"
           :controls="true"
              />
    </div>

  </div>
</template>

<script>
  import VideoBlock from './VideoBlock.vue'
  var queryString = require('query-string')
  var golos = require('golos-js')
  import FixedElements from './FixedElements.vue'
  import Sidebar from './Sidebar.vue'
  import Category from './Category.vue'
  export default {
    name: 'app',

    components: {
      FixedElements,
      Sidebar,
      VideoBlock,
    },

    data: function() {
      return {
        video: {}
      };
    },

    created: function() {
      var vm = this;
      var queries = queryString.parse(location.search);
      golos.api.getContent(queries.a, queries.v, function(err, result) {
        if (!err) {
          vm.video = {
            title: result.title,
            ipfs_id: result.body,
            author: queries.a,
          }
        } else {
          console.log(err);
        }
      });

    }
  }
</script>

<style>
#app {
  padding-top: 4em;
}

#main {
  margin-left: 12.5em;
}

video {
  width: 80%;
}
</style>
