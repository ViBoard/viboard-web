<template>
  <div id="app">
    <FixedElements/>
    <Sidebar/>
    <div id="box">
      <div id="main">
        <div id="alerts"></div>
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
        <div id="errors">{{ message }}</div>
        <div id="loader-wrap" v-if="spinning">
          <div class="loader">Загрузка...</div>
        </div>
        <button id="upload" v-if="!spinning" ref="upload" @click="upload()"> Загрузить</button>
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

    data: function() {
      return {
        spinning: false,
        message: "",
      }
    },

    methods: {
      upload: function () {
        var vm = this;
        
        const img_reader = new FileReader();
        const video_reader = new FileReader();

        vm.message = "";
        vm.spinning = true;
        img_reader.onloadend = function () {
          const video = vm.$refs.videofile;
          try {
            video_reader.readAsArrayBuffer(video.files[0]);
          } catch(e) {
            vm.message = "Ошибка при чтении видео"
            vm.spinning = false;
            return;
          }
          video_reader.onloadend = function() {
            const ipfs = ipfsAPI('https://viboard.me', 81);
            const img_buf = buffer.Buffer(img_reader.result);
            const video_buf = buffer.Buffer(video_reader.result);
            var files = [
              { content: video_buf },
              { content: img_buf }
            ]
            ipfs.files.add(files, (err, result) => {
              if (err) {
                console.error(err);
                vm.message("Ошибка при загрузке файлов");
                vm.spinning = false;
                return
              }
              console.log(result);

              let video_url = `https://ipfs.io/ipfs/${result[0].hash}`;
              let img_url = `https://ipfs.io/ipfs/${result[1].hash}`;
              console.log('img', img_url);
              console.log('video', video_url);
              var login = Cookies.get("login");
              var password = Cookies.get("posting_private");

              var auths = {
                posting: [[golos.auth.wifToPublic(password)]] // golos.auth.wifToPublic(password)
              };

              var verifyResult = golos.auth.verify(login, password, auths);
              console.log('ver_res', verifyResult);
              var wif = password;
              var parentPermlink = 'videotest';
              var author = login;
              var permlink = result[0].hash.toLowerCase() + Date.now();
              var title = vm.$refs.title.value;
              var body = `<a href="http://viboard.me/watch?v=${permlink}&a=${author}"><p>Смотреть на viboard.me</p><img src="${img_url}" alt="${result[0].hash}"></img></a>`
              let percent_steem_dollars = 10000; // 100% = 10000
              
              let tagList = vm.$refs.tags.value.split(' ', 4);
              tagList.unshift(parentPermlink);
              console.log(tagList);
              let jsonMetadata = {
                app: "viboard",
                tags: tagList
              };
              console.log(jsonMetadata);
              
              let beneficiariesObj = [
                [0, {
                  "beneficiaries": [{"account": "viboard","weight": 1000}]
                }]
              ];
              
              let newTx = [
                ["comment", {
                  "parent_author": "",
                  "parent_permlink": parentPermlink,
                  "author": author,
                  "permlink": permlink,
                  "title": title,
                  "body": body,
                  "json_metadata": JSON.stringify(jsonMetadata)
                }],
                ["comment_options", {
                  "author": author,
                  "permlink": permlink,
                  "max_accepted_payout": '1000000.000 GBG',
                  "percent_steem_dollars": percent_steem_dollars,
                  "allow_votes": true,
                  "allow_curation_rewards": true,
                  "extensions": beneficiariesObj
                }]
              ];
              
              let now = new Date().getTime() + 18e5;
              let expire = new Date(now).toISOString().split('.')[0];
              
              golos.api.getDynamicGlobalProperties(function (e, g) {
                if (e) return alert(tryAgain);
                let taposBlock = g.head_block_number - 2;
            
                golos.api.getBlockHeader(taposBlock, function (err, blockLink) {
                  if (err) return alert(tryAgain);
                  let blockid = blockLink.previous;
                  n = [];
                  
                  
                  for (let i = 0; i < blockid.length; i += 2) {
                    n.push(blockid.substr(i, 2));
                  }
                  let hex = n[7] + n[6] + n[5] + n[4];
                  let refBlockNum = taposBlock - 1 & 0xffff;
                  let refBlockPrefix = parseInt(hex, 16);


                  let trx = {
                    "expiration": expire,
                    "extensions": [],
                    "operations": newTx,
                    "ref_block_num": refBlockNum,
                    "ref_block_prefix": refBlockPrefix
                  };


                  let trxs = "";
                  try {
                    trxs = golos.auth.signTransaction(trx, {
                      "posting": wif
                    });
                  } catch (error) {
                    console.log(error);
                    return alert("Не удалось подписать транзакцию c постом. Откройте консоль браузера для просмотра подробностей" + error.message);
            
                  }
                  console.log(JSON.stringify(trxs));

                  golos.api.broadcastTransactionSynchronous(trxs, function (err, result) {
                    console.log(err, result);
                    
                    if (!err) {
                      window.location.replace(`/watch?v=${permlink}&a=${author}`);
                    } else {
                      vm.message = "Ошибка при создании поста";
                      vm.spinning = false;
                      console.log(err);
                    }
                  });
                });
              });

              // golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function (err, result) {
              //   if (!err) {
              //     window.location.replace(`/watch?v=${permlink}&a=${author}`);
              //   } else {
              //     vm.message = "Ошибка при создании поста";
              //     vm.spinning = false;
              //     console.log(err);
              //   }
              // });
            }, false);
          };
        };
        console.log(this.$refs);
        const img = this.$refs.imgfile;
        try {
          img_reader.readAsArrayBuffer(img.files[0]);
        } catch (e) {
          vm.message = "Ошибка при чтении превью"
          vm.spinning = false;
          return;
        }
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

#loader-wrap {
  max-height: 3em;
}

.loader,
.loader:before,
.loader:after {
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation: load7 1.8s infinite ease-in-out;
  animation: load7 1.8s infinite ease-in-out;
}
.loader {
  color: #292929;
  font-size: 10px;
  margin: 80px auto;
  position: relative;
  text-indent: -9999em;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
.loader:before,
.loader:after {
  content: '';
  position: absolute;
  top: 0;
}
.loader:before {
  left: -3.5em;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.loader:after {
  left: 3.5em;
}
@-webkit-keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
@keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}

</style>
