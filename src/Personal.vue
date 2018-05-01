<template>
  <div id="app">
    <Navigation/>
    <AppInner>
      <img src="./assets/test_hat.jpg" id="hat" class="img-fluid">
      <div id="header" class="info">
          <img src="./assets/test_hat.jpg" id="avatar" class="rounded-circle">
          <div id="info_block">
            <p id="nick">{{nickname}} </p>
            <p id="subscribers">{{subscribers}} подписчиков</p>
          </div>
          <button type="button" class="btn btn-light btn-lg" v-if="own">Настройки</button>
          <button type="button" class="btn btn-light btn-lg" v-if="yet && !own" v-on:click="subs(1)">Отписаться</button>
          <button type="button" class="btn btn-light btn-lg" v-on:click="subs(0)" v-if="!yet && !own">Подписаться</button>
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
        yet: false
      }
    },

    created: function() {
      var vm = this;

      let account = url.searchParams.get("author");
      vm.nickname = account;

      golos.api.getFollowCount(account, function(err, result) {
        if (!err) {
          vm.subscribers = result['follower_count'];
        }
        else console.error(err);
      });

      if (Cookies.get("login") == account) {
        vm.own = true
      }

      golos.api.getFollowers(account, '', null, 100, function(err, result) {
        //console.log(err, result);
        if (! err) {
          result.forEach(function(item) {
            console.log('getFollowers', item);
            if(item['follower'] == Cookies.get("login")) {
              console.log(item['follower'], " ", Cookies.get("login") );
              vm.yet = true;
            }
          });
        }
        else console.error(err);
      });
    },

    methods: {
      subs: function (flag) {
        var vm = this;
        if(Cookies.get("login")) {
          const follower = Cookies.get("login");
          const following = url.searchParams.get("author");
          const wif = Cookies.get("posting_private");
          let json;
          if(flag==0) {
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
          golos.broadcast.customJson(
            wif,[],[follower],
            'follow',
            json,
            (err,result)=> {
              console.log(err,result);
            }
          );

          console.log('before ', vm.yet);
          vm.yet = !vm.yet;
          console.log('after ', vm.yet);
        }
        else {
          alert("Сначала войдите!");
        }
      }
    }
  }


</script>

<style>
  #hat {
    height: 20%;
    width: 100%;
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

  .btn {
    flex: 10%;
    margin-top: 0.4em;
    margin-right: 30px;
    height: 10%;
    font-size: x-large;
  }
</style>
