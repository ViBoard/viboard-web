<template>
  <div class="golos">
    <div class="golos-info">
      <img :src="avatar_src" id="golos-avatar"></img>
      <strong>{{ author }}</strong></strong>
    <span class="reputation">{{ reputation }}</span>
      <span> в <strong>viboard-videos</strong></span>
    </div>
    <a href="#">Смотреть на viboard.me</a>
    <img :src="previewSrc"></img>
    <div class="video-description">{{description}}</div>
  </div>
</template>

<script>
  import Upvotes from './Upvotes.vue';
  import {PlyrVideo} from 'vue-plyr';
  var golos = require('golos-js');

  export default {
    name: 'SinglePreview',

    components: {
      Upvotes,
      PlyrVideo,
    },

    props: {
      author: {
        type: String,
        required: true,
      },
      previewSrc: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },

    data: function() {
      return {
        reputation: 99,
        avatar_src: require("./assets/golos_userpic.png"),
      }
    },

    created: function() {
      var vm = this;
      golos.api.getAccounts([vm.author], function(err, response) {
        try {
          var metadata = JSON.parse(response[0].json_metadata);
          var image = metadata.profile.profile_image;
          if (image) {
            vm.avatar_src = image;
          }
        } catch(e) {
          // default avatar
        }
      });
    }
  }
</script>

<style>

.golos {
  font-family: Source Serif Pro, serif;
  background: #fefefe;
  padding: 1em;
  margin-left: 1em;
}

.golos-info {
  font-family: Helvetica Neue,Arial,Roboto,sans-serif;
  color: #8a8a8a;
  margin-bottom: 1em;
}

.reputation {
    display: inline-block;
    font-size: 12px;
    padding: 0 3px;
    margin-left: 2px;
    margin-right: 2px;
    background-color: #f8f8f8;
    border-radius: 50%;
    border: 1px solid #dadada;
    color: #8a8a8a;
}

#golos-avatar {
  height: 36px;
  border-radius: 50%;
}

.golos img {
  max-width: 90%;
} 
</style>
