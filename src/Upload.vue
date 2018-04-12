<template>
  <div id="app">
    <FixedElements/>
    <Sidebar/>
    <div id="box">
      <div id="main">
        <span class="input-title">Выберите видео:</span>
        <input id="video-file" type="file" ref="videofile">
        <hr>

        <span class="input-title">Выберите превью:</span>
        <input id="img-file" type="file" ref="imgfile">
        <hr>

        <span class="input-title">Название:</span>
        <input id="video-title" type="text" ref="title">
        <hr>

        <span class="input-title">Тэги:</span>
        <input id="video-tags" type="text" ref="tags">
        <hr>

        <button id="upload" @click="upload()"> Загрузить</button>
      </div>
    </div>
  </div>
</template>

<script>
  var buffer = require("buffer");
  var ipfsAPI = require("ipfs-api");
  var golos = require("golos-js");
  var Cookies = require('js-cookie');

  import FixedElements from './FixedElements.vue'
  import Sidebar from "./Sidebar";

  export default {
    name: 'app',
    components: {
      Sidebar,
      FixedElements,
    },

    methods: {
      upload: function () {
        const img_reader = new FileReader();
        const video_reader = new FileReader();

        var vm = this;
        img_reader.onloadend = function () {
          const video = vm.$refs.videofile;
          video_reader.readAsArrayBuffer(video.files[0]);
          video_reader.onloadend = function() {
            const ipfs = ipfsAPI('viboard.me', 81);
            const img_buf = buffer.Buffer(img_reader.result);
            const video_buf = buffer.Buffer(video_reader.result);
            ipfs.files.add(img_buf, (err, img_result) => {
              console.log(img_result);
              ipfs.files.add(video_buf, (err, video_result) => {
                if (err) {
                  console.error(err);
                  return
                }

                let img_url = `https://ipfs.io/ipfs/${img_result[0].hash}`;
                let video_url = `https://ipfs.io/ipfs/${video_result[0].hash}`;
                console.log(`img Url --> ${img_url}`);
                console.log(`video Url --> ${video_url}`);
                var login = Cookies.get("login");
                var password = Cookies.get("posting_private");

                var auths = {
                  posting: [[golos.auth.wifToPublic(password)]] // golos.auth.wifToPublic(password)
                };

                var verifyResult = golos.auth.verify(login, password, auths);
                console.log('ver_res', verifyResult);
                var wif = password;
                var parentAuthor = '';
                var parentPermlink = 'videotest';
                var author = login;
                var permlink = result[0].hash.toLowerCase() + Date.now();
                var title = vm.$refs.title.value;
                var body = `<a href="http://viboard.me/watch?v=${permlink}&a=${author}"><img src="http://www.viboard.me/dist/banner.png" alt="${result[0].hash}"></img></a>`

                var tagList = vm.$refs.tags.value.split(' ', 4);
                tagList.unshift(parentPermlink);
                console.log(tagList);
                var jsonMetadata = {
                  tags: tagList
                };
                console.log(jsonMetadata);

                golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function (err, result) {
                  if (!err) {
                    window.location.replace(`/watch?v=${permlink}&a=${author}`);
                  } else {
                    console.log(err);
                  }
                });
              }, false);
            }, false);
          };
        };
        console.log(this.$refs);
        const img = this.$refs.videofile;
        img_reader.readAsArrayBuffer(img.files[0]);
      }
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
    height: 50%;
    width: 50%;
    margin-left: 25%;
    align-content: center;

  }

  .input-title {
    display: block;
    margin-top: 1em;
    font-size: 1.5em;
  }

  #video-file, #img-file {
    margin-top: 0.75em;
  }

</style>
