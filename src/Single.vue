<template>
  <div id="app">
    <FixedElements/>
    <Sidebar/>
    <div id="main">
    <video-block 
           :author="author"
           :permlink="permlink"
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
        author: "",
        permlink: "",
      };
    },

    created: function() {
      var queries = queryString.parse(location.search);
      this.author = queries.a;
      this.permlink = queries.v;
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
