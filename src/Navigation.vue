<template>
  <div id="navigation">
    <b-navbar toggleable="lg" fixed="top" class="bg-white" id="header">
      <b-navbar-brand href="/" id="logo">
        <img height="30" src="./assets/logo.jpg">
      </b-navbar-brand>
      <b-navbar-brand class="navbar-brand" href="/">
        <img height="30">
      </b-navbar-brand>
      
      <b-navbar-toggle class="ml-auto" target="nav_collapse"></b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav class="ml-auto" v-if="logged_in">
          <b-nav-item href="/upload">
            <span id="upload">Загрузить</span>
          </b-nav-item>
          <b-nav-item>
            <span id="nickname" @click="nickname_click">{{login}}</span>
          </b-nav-item>
          <b-nav-item>
            <span id="signout" @click="signout">Выйти</span>
          </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto" v-else>
          <b-nav-item>
            <span id="signup" v-b-modal.signup_modal>Регистрация</span>
          </b-nav-item>
          <b-nav-item>
            <span id="signin" v-b-modal.login_modal>Вход</span>
          </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="d-lg-none">
          <div v-for="item in SideLinksList">
            <a class="nav-link text-dark" :href="item.href">
              <i :class="item.icon"></i> {{ item.text }}
            </a>
          </div>
        </b-navbar-nav>
      
      </b-collapse>
      
      <b-modal id="signup_modal"
               ref="signup_modal"
               title="Регистрация"
               ok-title="Создать аккаунт"
               ok-variant="dark"
               @ok="register"
               cancel-variant="light"
               cancel-title="Отмена">
        <b-alert variant="success" ref="reg_result_success">
          Отлично! Теперь подтвердите Email
        </b-alert>
        <b-alert variant="danger" ref="reg_result_fail">Ошибка</b-alert>
        <b-form>
          <b-form-group>
            <b-form-input id="login-reg" type="text" placeholder="Логин" name="login" required/>
          </b-form-group>
          <b-form-group>
            <b-form-input id="email-reg" type="text" placeholder="Email" name="email" required/>
          </b-form-group>
          <b-form-group>
            <b-form-input id="pswd-reg" type="password" placeholder="Пароль" name="pswd" required/>
          </b-form-group>
          <b-form-group>
            <b-form-input id="beta-key-reg" type="text" placeholder="Код" name="beta-key" required/>
          </b-form-group>
        </b-form>
      </b-modal>
      
      <b-modal id="login_modal"
               ref="login_modal"
               title="Вход"
               ok-title="Войти"
               ok-variant="dark"
               @ok="auth"
               cancel-variant="light"
               cancel-title="Отмена">
        <b-alert variant="success" ref="auth_result_success">
          Успешно
        </b-alert>
        <b-alert variant="danger" ref="auth_result_fail">Ошибка</b-alert>
        <b-form>
          <b-form-group>
            <b-form-input id="login-name" type="text" placeholder="Логин" name="login" required/>
          </b-form-group>
          <b-form-group>
            <b-form-input id="login-pass" type="password" placeholder="Пароль" name="pswd" required/>
          </b-form-group>
          <b-form-group>
            <b-form-checkbox id="remember-me" name="remember">Запомнить меня</b-form-checkbox>
          </b-form-group>
        </b-form>
      </b-modal>
    </b-navbar>
    </b-row>
    <div class="container-fluid position-fixed d-none d-lg-block bg-light" style="padding-top: 7em; height:100%">
      <b-row>
        <b-col id="sidebar" lg="3">
          <div v-for="item in SideLinksList">
            <a class="nav-link text-dark" :href="item.href">
              <i :class="item.icon"></i> {{ item.text }}
            </a>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'
  import 'vue-plyr/dist/vue-plyr.css';
  import BootstrapVue from 'bootstrap-vue'
  import fontawesome from '@fortawesome/fontawesome'
  import faHome from '@fortawesome/fontawesome-free-solid/faHome'
  import faFire from '@fortawesome/fontawesome-free-solid/faFire'
  import faTrophy from '@fortawesome/fontawesome-free-solid/faTrophy'
  
  fontawesome.library.add(faHome)
  fontawesome.library.add(faFire)
  fontawesome.library.add(faTrophy)
  var golos = require("golos-js");
  var Cookies = require('js-cookie');
  golos.config.set('websocket', 'wss://ws.golos.io');
  import Vue from 'vue'
  
  Vue.use(BootstrapVue);
  
  export default {
    name: 'Navigation',
    data: function () {
      return {
        logged_in: false,
        login: "pass",
        SideLinksList: [
          {id: 0, text: 'Главное', href: '/', icon: 'fas fa-fw fa-home'},
          {id: 1, text: 'Новое', href: 'new', icon: 'fas fa-fw fa-fire'},
          {id: 2, text: 'Выбор редакции', href: '#', icon: 'fas fa-fw fa-trophy'},
        ],
      }
    },
    
    created: function () {
      var vm = this;
      var temp_login = Cookies.get("login");
      console.log('loggggg', temp_login);
      if (temp_login) {
        vm.login = temp_login;
        vm.logged_in = true;
      }
    },
    
    methods: {
      register: function (evt) {
        evt.preventDefault();
        let vm = this;
        vm.$refs.reg_result_fail.show = false;
        vm.$refs.reg_result_success.show = false;
        let new_account_name = document.getElementById("login-reg").value;
        let email = document.getElementById("email-reg").value;
        let pswd = document.getElementById("pswd-reg").value;
        let beta_key = document.getElementById("beta-key-reg").value;
        
        
        //check correct
        let accounts = [new_account_name];
        golos.api.getAccounts(accounts, function (err, result) {
          if (!err) {
            if (!result.length) {
              let newKeys = golos.auth.generateKeys(new_account_name, pswd, ['owner', 'active', 'posting', 'memo']);
              console.log('newKeys:', newKeys);
              
              let xhr = new XMLHttpRequest();
              xhr.open("POST", "http://localhost:3000", true);
              xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
              let send_req = "purpose=add&new_account_name=" + new_account_name + "&owner=" + newKeys.owner + "&active=" + newKeys.active
                + "&posting=" + newKeys.posting + "&memo=" + newKeys.memo + "&email=" + email + "&beta_key=" + beta_key + "&email=" + email;
              xhr.send(send_req);
              xhr.onreadystatechange = function () {
                console.log("readyState:", xhr.readyState);
                // 4 = DONE
                if (xhr.readyState == 4) {
                  console.log("answer:", xhr.responseText);
                  if (xhr.responseText == "(0) Now confirm email") {
                    vm.$refs.reg_result_success.show = true;
                    vm.$refs.reg_result_fail.show = false;
                    // Cookies.set("login", new_account_name);
                    let roles = ['posting'];
                    let keys = golos.auth.getPrivateKeys(new_account_name, pswd, roles);
                    
                    
                    console.log("newKeys.posting:", keys.posting);
                    Cookies.set("posting_private", keys.posting);
                    // setTimeout(function() { vm.$refs.signup_modal.hide() } , 500);
                    // vm.login = new_account_name;
                    // vm.logged_in = true;
                  } else {
                    vm.$refs.reg_result_success.show = false;
                    vm.$refs.reg_result_fail.show = true;
                  }
                }
              }
            } else {
              console.log("Логин занят!");
            }
          }
          else console.error(err);
        });
        
        // \check correct
        
        // request.post({url:'http://localhost:3000/', form: {my_key:'edited_value'}}, function(err,httpResponse,body){ /* ... */ })
      },
      
      signout: function () {
        Cookies.remove("login");
        Cookies.remove("posting_private");
        this.logged_in = false;
      },
      
      nickname_click: function () {
        var videolist = document.getElementsByClassName("videofoo");
        console.log("wqefsgdfd");
        for (var i = 0; i < videolist.length; i++) {
          videolist[i].style.height = 9 / 16 * videolist[i].offsetWidth;
          console.log(videolist[i].style.height, videolist[i].offsetWidth);
        }
      },
      
      auth: function (evt) {
        evt.preventDefault()
        var vm = this;
        vm.$refs.auth_result_fail.show = false;
        vm.$refs.auth_result_success.show = false;
        var login = document.getElementById("login-name").value;
        var password = document.getElementById("login-pass").value;
        var remember_me = document.getElementById("remember-me").checked;
        
        var accounts = [login];
        golos.api.getAccounts(accounts, function (err, result) {
          console.log(err, result);
          if (!err) {
            result.forEach(function (item) {
              var postingPubkey = item.posting.key_auths[0][0];
              console.log('getAccounts', item.posting); // Костыль?
              
              var auths = {
                posting: [[postingPubkey]]
              };
              
              var verifyResult = golos.auth.verify(login, password, auths);
              console.log('verify', verifyResult);
              
              var roles = ['posting'];
              var keys = golos.auth.getPrivateKeys(login, password, roles);
              
              if (verifyResult) {
                vm.$refs.auth_result_success.show = true;
                vm.$refs.auth_result_fail.show = false;
                Cookies.set("login", login);
                // Cookies.set("password", password, {});
                Cookies.set("posting_private", keys.posting);
                setTimeout(function () {
                  vm.$refs.login_modal.hide()
                }, 500);
                vm.login = login;
                vm.logged_in = true;
              } else {
                console.log(123);
                vm.$refs.auth_result_success.show = false;
                vm.$refs.auth_result_fail.show = true;
              }
            });
          }
          else console.error(err);
        });
        
        // var roles = ['owner', 'active', 'posting', 'memo'];
        // var keys = golos.auth.getPrivateKeys(login, password, roles);
        // console.log('getPrivateKeys', keys);
        //
        // var resultWifToPublic = golos.auth.wifToPublic(keys.posting, keys.postingPubkey);
        // console.log('wifToPublic', resultWifToPublic);
        
        // var roles = ['owner', 'active', 'posting', 'memo'];
        // console.log(login, password, remember_me);
        // var pkey = golos.auth.getPrivateKeys(login, password, roles);
        // console.log('postingPubkey', pkey);
        // var resultWifIsValid = golos.auth.wifIsValid(pkey['posting'], pkey['postingPubkey']);
        // console.log('wifIsValid', resultWifIsValid);
        
        
      }
      
      
    }
  }
</script>

<style>
  #logo {
    position: fixed;
    left: 50%;
    top: 8px;
    transform: translateX(-50%);
  }
  
  .fas {
    margin-right: 3em;
  }
  
  #header {
    -webkit-box-shadow: 0px 1px 5px 0px rgba(136, 136, 136, 0.2);
    -moz-box-shadow: 0px 1px 5px 0px rgba(136, 136, 136, 0.2);
    box-shadow: 0px 1px 5px 0px rgba(136, 136, 136, 0.2);
  }
</style>
