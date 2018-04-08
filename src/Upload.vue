<template>
  <div id="app">
    <FixedElements/>

    <div id="box">
      <div id="main">
        <span class="input-title">Название:</span>
        <input id="video-title" type="text" ref="title">
        <input id="video-file" type="file" value="Выбрать файл.." ref="file">
        <span class="input-title">Тэги:</span>
        <input id="video-tags" type="text" ref="tags">
        <button id="upload" @click="upload()"> Загрузить </button>
      </div>
    </div>
  </div>
</template>

<script>
  var buffer = require("buffer");
  var ipfsAPI = require("ipfs-api")
  var golos = require("golos-js")
  import FixedElements from './FixedElements.vue'
  import Sidebar from "./Sidebar";
  export default {
    name: 'app',
    components: {
      Sidebar,
      FixedElements,
    },

    methods: {
     upload: function() {
        const reader = new FileReader();
        var vm = this;
        reader.onloadend = function() {
          const ipfs = ipfsAPI('viboard.me', 81)
          const buf = buffer.Buffer(reader.result)
          ipfs.files.add(buf, (err, result) => {
            if(err) {
              console.error(err)
              return
            }

            let url = `https://ipfs.io/ipfs/${result[0].hash}`
            console.log(`Url --> ${url}`)
            var login = "mmalikov";
            var password = "P5K6kcP1SYbgDUywsCSMiSVWuJdADFcw43XTDQzjfGxTqcjpW2Ab";
            var post_password = "GLS7m8NasReBvir3AqWbiVnNDoSgUKhb2pwK4jcuB4VtJhAWZ6J9t";
            var priv_post_password = "5HzbpzRRy6th3FYQpXb9AmKwC461ZCkFdmyqcpXciwVupxweLoR";

            var auths = {
              posting: [[post_password]]
            };

            var verifyResult = golos.auth.verify(login, password, auths);
            var wif = priv_post_password;
            var parentAuthor = '';
            var parentPermlink = 'videotest';
            var author = login;
            var permlink = result[0].hash.toLowerCase();
            var title = vm.$refs.title.value;
            var body = `
              <iframe src="viboard.me/embed?a=${author}&v=${permlink}"></iframe>
              <img src="http://www.1x1px.me/#" alt="${result[0].hash}"`
          
            var tagList = vm.$refs.tags.value.split(' ', 4);
            console.log(tagList);
            var jsonMetadata = {
              tags: tagList.unshift(parentPermlink) 
            };
            console.log(jsonMetadata);

            golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function(err, result) {
              if (!err) {
                window.location.replace('/');
              } else {
                console.log(err);
              }
            });
          }, false);
        }
        const video = this.$refs.file;
        reader.readAsArrayBuffer(video.files[0]);
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
    margin-top: 2em;
    font-size: 1.5em;
  }

</style>
