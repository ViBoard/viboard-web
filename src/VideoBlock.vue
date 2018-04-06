<template>
  <div class='video-block'>
    <a :href="'watch?v=' + video.ipfs_id.toLowerCase() + '&a=' + video.author">
    <video :autoplay="ap ? true : false"
           :muted="muted ? true : false"
           :controls="controls ? true : false"
           :src="'https:/ipfs.io/ipfs/' + video.ipfs_id" muted> </video>
    </a>
    <div class="video-header"> {{ video.title }} </div>
    <div class="video-info">
      <div class="video-author"> {{video.author }} </div>
      <div class="video-total"> {{video.total }} </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoBlock',

  props: {
    video: {
      type: Object,
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
  }

}
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
