<template>
  <div class='video-block'>
    <a :href="controls ? '#' : getHref">
    <video :autoplay="ap ? true : false"
           :muted="muted ? true : false"
           :controls="controls ? true : false"
           :src="src"></video>
    </a>
    <div class="video-header"> {{ title }} </div>
    <div class="video-info">
      <div class="video-author"> {{ author }} </div>
      <div class="video-total"> {{ total }} </div>
    </div>
  </div>
</template>

<script>
var golos = require('golos-js')

export default {
  name: 'VideoBlock',

  props: {
    permlink: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    ap: {
      type: Boolean,
      required: true,
    },
    muted: {
      type: Boolean,
      required: true,
    },
    controls: {
      type: Boolean,
      required: true,
    }
  },

  data: function() {
    return {
      src: "",
      title: "",
      total: "",
    }
  },

  computed: {
    getHref: function() {
      return 'watch?v=' + this.permlink + '&a=' + this.author
    }
  },

  created: function() {
    var vm = this;
    golos.api.getContent(vm.author, vm.permlink, function(err, result) {
      if (!err) {
        console.log(result);
        vm.title = result.title;
        vm.total = result.pending_payout_value;
        var regexp = RegExp('<img src=".*" alt="(.*)"');
        var ipfs_id = regexp.exec(result.body)[1];
        vm.src = "http://ipfs.io/ipfs/" + ipfs_id;
      } else {
        console.log(err);
      }
    });
  }}
</script>

<style>
  .video-header {
    overflow:hidden;
    font-size: 1.1em;
    margin-top: 0.3em;
  }

  .video-info {
    font-size: 0.9em;
    color: #888;
  }

  .video-info div {
    margin: 0;
    padding: 0;
    margin-top: 0.25em;
  }

  .video-author{
  }

  .video-total {
    color: black;
  }
</style>
