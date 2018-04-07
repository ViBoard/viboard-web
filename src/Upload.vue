<template>
  <div id="app">
    <FixedElements/>

    <div id="box">
      <div id="main">
        <span class="input-title">Заголовок видео:</span>
        <input id="video_name" type="text">
        <span class="input-title">Тэги:</span>
        <input id="video_tags" type="text">
        <input id="video_file" type="file" value="Choose file.." style="display:block; position:relative; opacity:1; top:auto; left:40%; width:auto; font-size:1em; margin-top:1em">
        <button id="upload" onclick=upload()> Загрузить видео </button>

      </div>
    </div>
  </div>
</template>

<script>
  import FixedElements from './FixedElements.vue'
  import Sidebar from "./Sidebar";
  export default {
    name: 'app',
    components: {
      Sidebar,
      FixedElements,
    }
  }

</script>

<style>
  #app {
    padding-top: 4em;
  }


  #box {
    padding-top: 4em;
    height: 100%;
    margin-left: 10%;
    margin-right: 10%;
    background: #ffffff;
  }

  #main {
    text-align:center;
    height: 50%;
    width: 50%;
    margin-left: 25%;
    align-content: center;

  }

  .input-title {
    display: block;
    margin-top: 2em;
    font-size: 1.5em;
  }

</style>
