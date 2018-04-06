<template>
  <div id="app">
    <a :href="'vidoardwatch?v=' + video.ipfs_id.toLowerCase() + '&a=' + video.author">
      <video :src="'https:/ipfs.io/ipfs/' + video.ipfs_id" muted> </video>
    </a>
  </div>
</template>

<script>
  export default {
    name: 'app',
  }

</script>
