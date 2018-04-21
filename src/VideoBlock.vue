<template>
  <div class='video-block'>
    <a :href="controls ? '#' : getHref">
      <div v-if="isPreview" class="video-element">
        <img :src="previewSrc">
      </div>
      <plyr-video v-else-if="custom_player" :poster="previewSrc"
                  :videos="this.videos"
                  :autoplay="ap ? true : false"
                  :muted="muted ? true : false"
                  :controls="customControls"
                  :crossorigin="true"/>
      <video v-else class="video-element"
             :autoplay="ap ? true : false"
             :muted="muted ? true : false"
             :controls="controls ? true : false"
             :src="src">
      </video>
      
    
    </a>
    <div class="video-header"> {{ title }}</div>
    <div class="video-info">
      <div class="video-author"> {{ author }}</div>
      <div class="video-total"> {{ total }}</div>
    </div>
  </div>
</template>

<script>
  import { parseBody } from './parseBody.js'
  import {PlyrVideo} from 'vue-plyr'
  // import 'vue-plyr/dist/vue-plyr.css'
  
  var golos = require('golos-js')
  
  export default {
    name: 'VideoBlock',
    
    components: {
      PlyrVideo,
    },
    
      mixins: [parseBody],
    
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
      },
      isPreview: {
        type: Boolean,
        default: false,
      },
      custom_player: {
        type: Boolean,
        default: false,
      }
    },
    
    data: function () {
      return {
        src: "",
        previewSrc: "",
        title: "",
        total: "",
        videos: [],
        customControls: ``,
      }
    },
    
    computed: {
      getHref: function () {
        return 'watch?v=' + this.permlink + '&a=' + this.author
      }
    },
    
    created: function() {
      var vm = this;
      golos.api.getContent(vm.author, vm.permlink, function(err, result) {
        if (!err) {
          vm.title = result.title;
          vm.total = result.pending_payout_value;
          var parsed = vm.parseBody(result.body)
          console.log(parsed)
          vm.previewSrc = parsed.previewSrc;
          console.log(vm.previewSrc);
          vm.src = "http://ipfs.io/ipfs/" + parsed.ipfs_id;
          vm.videos.push({src: vm.src, format: 'mp4'});
        } else {
          console.log(err);
        }
      });
    },
    
    mounted: function () {
      var videolist = document.getElementsByClassName("video-element");
      for (var i = 0; i < videolist.length; i++) {
        videolist[i].style.height = 9 / 16 * videolist[i].offsetWidth;
      }
    }
  }
</script>

<style>
  .video-header {
    overflow: hidden;
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
  
  .video-element {
    background-color: black;
    /*border: 1px solid black;*/
  }
  
  .video-element img {
    height: 100%;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
</style>
