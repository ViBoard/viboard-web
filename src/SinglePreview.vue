<template>
  <div>
    <plyr-video :poster="previewSrc"
                :autoplay="ap"
                :muted="muted"
                controls="customControls"
                :videos="[]"
                :crossorigin="true"/>


    <div class="video-header"> {{ title }}</div>
    <div class="video-info">
      <div class="video-author"> {{ author }}</div>
    </div>
    <div class="video-description">{{description}}</div>
  </div>
</template>

<script>
  import Upvotes from './Upvotes.vue'
  import {PlyrVideo} from 'vue-plyr'

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

    data: function () {
      return {
        ap: false,
        muted: false,
        controls: true,
      };
    },
  }
</script>

<style>
  .video-header {
    overflow: hidden;
    font-size: 1.1em;
    margin-top: 0.3em;
  }

  .video-description {
    word-wrap: break-word;
    white-space:pre-wrap;
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

  .plyr--video {
    width: 90%;
  }

  #comments {
    margin-top: 3em;
  }
</style>
