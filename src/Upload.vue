<template>
  <div id="app">
    <FixedElements/>

    <div id="box">
      <div id="main">
        <h5 style="font-size: 14px">Заголовок видео:</h5>
        <input style = "font-size: 2em; width: 70%; margin-bottom: 2em" id="video_name" type="text">
        <h5>Тэги:</h5>
        <input style = "font-size: 2em; width: 70%; margin-bottom: 2em" id="video_tags" type="text">
        <input id="video_file" type="file" value="Choose file.." style="display:block; position:relative; opacity:1; top:auto; left:40%; width:auto; font-size:1em; margin-top:1em">
        <button onclick=upload() style="background: black; color: white; font-size: 14px; border-radius: 3px; font-family: 'Open Sans', sans-serif; margin-top: 2em"> Загрузить видео </button>

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

</style>
