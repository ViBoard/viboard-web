<template>
  <div id="app">
    <Navigation/>
    <AppInner>
      <b-col lg=8 offset-lg=2>
        <b-form>
          <b-form-group label="Видео:">
            <b-form-file @input="set_preview_url" placeholder="Выбрать файл..." id="video-file" type="file" v-model="videofile"/>
          </b-form-group>

         <b-form-group v-if="show_previews_row" label="Превью:">
           <div v-if="!preview_file_chosen">
             <table>
               <tr>
                 <td v-for="i in n_previews" style="padding: 0.2em">
                   <video :class="{'embed-responsive': true, 'focused': preview_frame_chosen == i - 1}" 
                          tabindex="0" 
                          :src="video_src"
                          @click="choose_preview_frame(i - 1)"
                          @loadedmetadata="generate_previews(false)"
                          :ref="'preview' + (i - 1)">
                   </video>
                 </td>
               </tr>
             </table>
             <div class="d-flex align-items-center" style="margin-top: 0.7em">
               <b-button variant="outline-dark" @click="generate_previews(true)">Выбрать другие</b-button>
                <div style="margin-right: 0.5em; margin-left: 0.5em"> или </div>
               <b-form-file placeholder="Выбрать файл..." 
                            id="img-file" 
                            type="file" 
                            @input="choose_preview_file"
                            v-model="imgfile"/>
             </div>
           </div>
           <div v-else>
              <b-img :src="preview_url" class="embed-responsive"></b-img>
              <div class="d-flex align-items-center" style="margin-top: 0.7em">
                <b-button variant="outline-dark" @click="preview_file = null">Выбрать кадр</b-button>
                <div style="margin-right: 0.5em; margin-left: 0.5em"> или </div>
                <b-form-file placeholder="Выбрать файл..." 
                            id="img-file" 
                            type="file" 
                            @input="choose_preview_file"
                            v-model="imgfile"/>
              </div>
            </div>
          </b-form-group>
          <canvas ref="canvas" style="display: none"></canvas>
          <b-form-group label="Название:">
            <b-form-input id="video-title" type="text" v-model="title"/>
          </b-form-group>

          <b-form-group label="Описание:">
            <b-form-textarea id="video-description" type="text" rows="5" v-model="description"/>
          </b-form-group>

          <b-form-group label="Тэги:">
            <vue-tags-input
                v-model="tag"
                :tags="tags"
                :addOnKey="[32]"
                placeholder="До четырёх тэгов через пробел"
                :maxTags="4"
                class=""
                @tags-changed="newTags => tags = newTags"/>
          </b-form-group>

          <b-alert variant="danger" ref="errors">{{ message }}</b-alert>
          <div id="loader-wrap" v-if="spinning">
            <div class="loader">Загрузка...</div>
          </div>
          <b-button id="upload" v-if="!spinning" ref="upload" @click="upload" variant="dark"> Загрузить</b-button>
        </b-form>
        <div v-if="video_src" style="margin-top: 5em; margin-bottom: 2em">
          <h5>Как будет выглядеть пост:</h5>
          <div class="d-flex">
            <div>
              <h6><strong>viboard.me</strong></h6>
              <SinglePreview :author="login"
                             :previewSrc="preview_url"
                             :title="title"
                             :description="description"/>
            </div>
            <div>
              <h6><strong>golos.io</strong></h6>
              <GolosPreview :author="login"
                            :previewSrc="preview_url"
                            :title="title"
                            :description="description"/>
            </div>
          </div>
        </div>
      </b-col>
    </AppInner>
  </div>
</template>

<script>
  var buffer = require("buffer");
  var ipfsAPI = require("ipfs-api");
  var golos = require("golos-js");
  var Cookies = require('js-cookie');
  import Navigation from './Navigation.vue'
  import AppInner from './AppInner.vue'
  import VueTagsInput from '@johmun/vue-tags-input';
  import SinglePreview from './SinglePreview.vue';
  import GolosPreview from './GolosPreview.vue';

  export default {
    name: 'app',
    components: {
      Navigation,
      AppInner,
      VueTagsInput,
      SinglePreview,
      GolosPreview,
    },

    data: function () {
      return {
        videofile: null,
        imgfile: null,
        tag: '',
        tags: [],
        spinning: false,
        message: "",
        title: "",
        description: "",
        n_previews: 4,
        video_src: "",
        show_previews_row: false,
        preview_frame_chosen: null,
        preview_file_chosen: false,
        preview_url: "",
        login: "",
      }
    },

    created: function() {
      this.login = Cookies.get('login');
    },

    methods: {
      set_preview_url: function() {
        var vm = this;
        vm.$refs.errors.show = false;
        vm.video_src = "";
        vm.show_previews_row = false;
        var mimeType = vm.videofile.type;
        if (mimeType.split('/')[0]=='video') {
          vm.video_src = URL.createObjectURL(vm.videofile);
          vm.show_previews_row = true;
        } else {
          vm.$refs.errors.show = true;
          vm.message = "Неподдерживаемый формат видео";
        }
       },

      generate_previews: function(is_random) {
        var vm = this; 
        var default_previews = [0, 0.1, 0.5, 0.8];
        var duration = vm.$refs.preview0[0].duration;
        for (var i = 0; i < vm.n_previews; ++i) {
          vm.$refs['preview' + i][0].currentTime = duration * (is_random ? Math.random() : default_previews[i]);
        }
      },

      choose_preview_frame: function(index) {
        var vm = this;
        vm.preview_frame_chosen = index;
        var canvas = vm.$refs.canvas;
        var ctx = canvas.getContext("2d");
        var video = vm.$refs["preview" + index][0];
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        vm.preview_url = canvas.toDataURL();
      },

      choose_preview_file: function() {
        var vm = this;
        vm.$refs.errors.show = false;
        vm.preview_file_chosen = false;

        var mimeType = vm.imgfile.type;
        if (mimeType.split('/')[0]=='image') {
           vm.preview_file_chosen = true;
           vm.preview_url = URL.createObjectURL(vm.imgfile); 
        } else {
          vm.$refs.errors.show = true;
          vm.message = "Неподдерживаемый формат изображения";
        }

      },
 
      upload: function () {
        let vm = this;

        let img_size = 0;
        let video_size = 0;

        vm.$refs.errors.show = false;

        vm.message = "";

        if (!vm.video_src) {
          vm.$refs.errors.show = true;
          vm.message = "Необходимо выбрать превью"
          return;
        }

        if (!vm.preview_url) {
          vm.$refs.errors.show = true;
          vm.message = "Необходимо выбрать превью"
          return;
        }

        if (!vm.title) {
          vm.$refs.errors.show = true;
          vm.message = "Название не может быть пустым";
          return;
        }

        const img_reader = new FileReader();
        const video_reader = new FileReader();

        vm.spinning = true;
        img_reader.onloadend = function () {
          const video = vm.videofile;
          try {
            video_size = video.size;
            video_reader.readAsArrayBuffer(video);
          } catch (e) {
            vm.message = "Ошибка при чтении видео";
            vm.$refs.errors.show = true;
            vm.spinning = false;
            return;
          }
          video_reader.onloadend = function () {
            const ipfs = ipfsAPI('viboard.me', 81, {protocol: 'https'});
            const img_buf = buffer.Buffer(img_reader.result);
            const video_buf = buffer.Buffer(video_reader.result);

            let files_img = [
              {content: img_buf}
            ];
            let files_video = [
              {content: video_buf}
            ];
            let progress_func_img = function (len) {
              console.log("img progress:", len, "/", img_size);
            };
            let progress_func_video = function (len) {
              console.log("video progress:", len, "/", video_size);
            };
            let options_img = {progress: progress_func_img};
            let options_video = {progress: progress_func_video};


            let img_url = undefined;
            let video_hash = undefined;

            function confirm_ipfs_upload(err, result, file_type) {
              if (err) {
                console.error(err);
                vm.message = "Ошибка при загрузке файлов";
                vm.$refs.errors.show = true;
                vm.spinning = false;
                return
              }
              console.log(result);

              if (file_type == "video") {
                video_hash = result[0].hash;
              } else if (file_type == "img") {
                img_url = `https://ipfs.io/ipfs/${result[0].hash}`;
              }
            }


            ipfs.files.add(files_img, (err, result) => {
              confirm_ipfs_upload(err, result, "img");

              ipfs.files.add(files_video, (err, result) => {
                confirm_ipfs_upload(err, result, "video");

                var login = Cookies.get("login");
                var password = Cookies.get("posting_private");

                var auths = {
                  posting: [[golos.auth.wifToPublic(password)]] // golos.auth.wifToPublic(password)
                };

                var verifyResult = golos.auth.verify(login, password, auths);
                console.log('ver_res', verifyResult);
                var wif = password;
                var parentPermlink = 'viboard-videos';
                var author = login;
                var permlink = video_hash.toLowerCase() + Date.now();
                var title = vm.title
                var description = vm.description
                var body = `<a href="https://viboard.me/watch?v=${permlink}&a=${author}"><p>Смотреть на viboard.me</p><img src="${img_url}" alt="${video_hash}"></a><p>${description}</p>`;
                console.log(body)
                let percent_steem_dollars = 10000; // 100% = 10000

                let tagList = [];
                for (var i = 0; i < vm.tags.length; ++i) {
                  tagList.push(vm.tags[i].text);
                }
                tagList.unshift(parentPermlink);
                console.log(tagList);
                let jsonMetadata = {
                  app: "viboard",
                  tags: tagList
                };
                console.log(jsonMetadata);

                let beneficiariesObj = [
                  [0, {
                    "beneficiaries": [{"account": "viboard", "weight": 1000}]
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
                    let n = [];


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
                        vm.$refs.errors.show = true;
                        vm.spinning = false;
                        console.log(err);
                      }
                    });
                  });
                });
              }, false);
            }, false);


          };
        };

        var img;
        if (vm.preview_file) {
          img = vm.imgfile;
          try {
            img_size = img.size;
            img_reader.readAsArrayBuffer(img);
          } catch (e) {
            console.log(e);
            vm.message = "Ошибка при чтении превью";
            vm.$refs.errors.show = true;
            vm.spinning = false;
            return;
          }
        } else {
          vm.$refs.canvas.toBlob(function(blob) {
            img_reader.readAsArrayBuffer(blob);
          });
        }
     }
    }
  }
</script>

<style>
  .focused {
    border-color: #80bdff;
    box-shadow: 0 0 0 0.4rem rgba(0, 123, 255, 0.4);
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
