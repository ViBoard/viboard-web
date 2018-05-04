<template>
  <div id="app">
    <Navigation/>
    <AppInner>
      <img :src="imghat" id="hat" class="img-fluid">
      <div id="personal_header" class="info">
          <img :src="imglogo" id="avatar" class="rounded-circle">
          <div id="info_block">
            <p id="nick">{{nickname}} </p>
            <p id="subscribers">{{subscribers}} подписчиков</p>
          </div>
          <button type="button" class="btn btn-light btn-lg butt" v-if="yet && !own" v-on:click="subs(1)">Отписаться</button>
          <button type="button" class="btn btn-light btn-lg butt" v-on:click="subs(0)" v-if="!yet && !own">Подписаться</button>
      </div>
      <Category title=""
                gridClass="grid-big"
                :nVideos="0"
                :ap="false"
                method="personal"
      />
    </AppInner>
  </div>
</template>

<script>
  import Navigation from './Navigation.vue'
  import Category from './Category.vue'
  import AppInner from './AppInner.vue'

  let golos = require('golos-js');
  let Cookies = require('js-cookie');
  let url = new URL(window.location.href);

  export default {
    name: 'app',
    components: {
      Navigation,
      Category,
      AppInner,
    },

    data: function() {
      return {
        nickname: "nickname",
        subscribers: 0,
        own: false,
        yet: false,

        imghat: "../data/ava.png",
        imglogo: "../data/hat.png"
      }
    },

    created: function() {
      let vm = this;
      let account = url.searchParams.get("author");
      vm.nickname = account;
      if (Cookies.get("login") === account) {
        vm.own = true
      }

      golos.api.getAccounts([account], function(err, result) {
        if (!err) {
          result.forEach(function(item) {
            if (item['json_metadata'] !== "") {
              function tryImage(URL) {
                let tester = new Image();
                tester.onerror=imageNotFound();
                tester.src=URL;
              }

              function imageNotFound() {
                vm.imglogo = "../data/hat.png";
              }

              let obj = JSON.parse(item['json_metadata']);
              if(obj['profile']['cover_image'] !== undefined) {
                if(obj['profile']['cover_image'] !== "") {
                  try {
                    vm.imghat = obj['profile']['cover_image'];
                    tryImage(obj['profile']['profile_image']);
                  }
                  catch (e) {
                    console.log("ОШИБКА ЗАГРУЗКИ ШАПКИ", e);
                  }
                }
              }
              if(obj['profile']['profile_image'] !== undefined) {
                if(obj['profile']['profile_image'] !== "") {
                  try {
                    vm.imglogo = obj['profile']['profile_image'];
                    tryImage(obj['profile']['profile_image']);
                  }
                  catch (e) {
                    console.log("ОШИБКА ЗАГРУЗКА АВАТАРКИ", e);
                  }
                }
              }
            }
          });
        }
        else console.error("ОШИБКА АПИ ПРИ ПОЛУЧЕНИИ ДАННЫХ ПОЛЬЗОВАТЕЛЯ", err);
      });

      let num = 0;
      let getPromise = new Promise((resolve, reject) => {
        golos.api.getFollowCount(account, function (err, result) {
          if (!err) {
            vm.subscribers = result['follower_count'];
            num = result['follower_count'];
            resolve();
          }
          else {
            console.error("ОШИБКА АПИ ПРИ ПОЛУЧЕНИИ КОЛИЧЕСТВА ПОЛЬЗОВАТЕЛЕЙ", err);
            reject(err);
          }
        });
      });

      let BreakException = {};
      getPromise.then((successMessage) => {
        let last = '';
        for (let i = 0, p = Promise.resolve(); i < num; i+= 100) {
          p = p.then((successMessage) => new Promise(resolve => {
              golos.api.getFollowers(account, last, null, 100, function (err, result) {
                last=result[result.length-1]['follower'];
                if (!err) {
                  try {
                    result.forEach(function (item) {
                      if (item['follower'] === Cookies.get("login") && item['what'][0] === 'blog') {
                        vm.yet = true;
                        throw BreakException;
                      }
                    });
                    resolve();
                  } catch (e) {
                    if (e !== BreakException) throw e;
                  }
                }
                else console.error("ОШИБКА АПИ ПРИ ПОЛУЧЕНИИ ПОДПИСЧИКОВ", err);
              });
            }
          ));
        }
      })
    },

    methods: {
      subs: function (flag) {
        var vm = this;
        if(Cookies.get("login")) {
          const follower = Cookies.get("login");
          const following = url.searchParams.get("author");
          const wif = Cookies.get("posting_private");
          let json;
          if(flag===0) {
            json = JSON.stringify(
              ['follow', {
                follower: follower,
                following: following,
                what: ['blog']
              }]
            );
          }
          else {
            json = JSON.stringify(
              ['follow', {
                follower: follower,
                following: following,
                what: ['']
              }]
            );
          }

          let getPromise = new Promise((resolve, reject) => {
            golos.broadcast.customJson(
              wif,[],[follower],
              'follow',
              json,
              (err,result)=> {
                resolve();
              }
            );
          });

          getPromise.then((successMessage) => {
            vm.yet = !vm.yet;
            location.reload();
          });
        }
        else {
          alert("Сначала войдите!");
        }
      },
    }
  }


</script>

<style>
  #hat {
    height: 20%;
    width: 100%;
  }

  #personal_header {
    -webkit-box-shadow: 0px 1px 5px 0px rgba(136, 136, 136, 0.2);
    -moz-box-shadow: 0px 1px 5px 0px rgba(136, 136, 136, 0.2);
    box-shadow: 0px 1px 5px 0px rgba(136, 136, 136, 0.2);
  }

  .info {
    display: flex;
    padding-top: 10px;
    font-family: sans-serif;
  }

  #avatar {
    margin-left: 10px;
    margin-bottom: 10px;
    width: 100px;
    height: 100px;
  }

  #info_block {
    flex: 80%;
    margin-left: 20px;
  }

  #nick{
    font-size: 2em;
  }

  #subscribers {
    font-size: 1.25em;
  }

  .butt {
    flex: 10%;
    margin-top: 0.4em;
    margin-right: 30px;
    height: 10%;
    font-size: x-large;
  }
</style>
