<template>
  <div id=container>
    <b-navbar class="d-none d-lg-block" id="sidebar">
      <b-card id="register" title="Регистрация">
        <b-alert variant="success" ref="reg_result_success">
          Отлично! Теперь подтвердите Email
        </b-alert>
        <b-alert variant="danger" ref="reg_result_fail">Ошибка</b-alert>
        <b-form>
          <b-form-group>
            <b-form-input v-model="reg_username" type="text" placeholder="Логин" name="login" required/>
          </b-form-group>
          <b-form-group>
            <b-form-input v-model="reg_email" type="text" placeholder="Email" name="email" required/>
          </b-form-group>
          <b-form-group>
            <b-form-input v-model=reg_password type="password" placeholder="Пароль" name="pswd" required/>
          </b-form-group>
          <b-button variant="primary" @click="register">Зарегистрироваться</b-button>

        </b-form>
 
        <h4 class="card-title">Войти через <a href="https://golos.io">golos.io</a></h4>
        <b-alert variant="success" ref="auth_result_success">
          Успешно
        </b-alert>
        <b-alert variant="danger" ref="auth_result_fail">Ошибка</b-alert>
        
        <b-form>
          <b-form-group>
            <b-form-input v-model="login_username" type="text" placeholder="Логин" name="login" required/>
          </b-form-group>
          <b-form-group>
            <b-form-input v-model="login_password" type="password" placeholder="Пароль" name="pswd" required/>
          </b-form-group>
          <b-button variant="primary" @click="login">Войти</b-button>
        </b-form>
        
        <b-button href="index" class="mt-3" variant="outline-primary">
         Продолжить без регистрации 
        </b-button>
      </b-card>
    </b-navbar>
    
    <b-navbar fixed="top" class="topbar d-none d-lg-block">
      <div class="container-fluid">
        <img src="./assets/logo-wide.png" width="40%">
      </div>
    </b-navbar>
    
    <b-container fluid id="main">
      <b-row class="d-lg-none">
        <a href="index">
          <img src="./assets/logo.jpg"></img>
        </a>
      </b-row>
      <b-row id="row1">
        <b-col lg=6 offset-lg=6>
          <h1>Новый взгляд на сферу видеоконтента</h1>
          <p>Добро пожаловать в мир, где зарабатывают на создании видеороликов, комментировании и оценке.</p>
        </b-col>
      </b-row>
      
      <b-row id="row2">
        <b-col>
          <img src="./assets/shutup.gif">
        </b-col>
        <b-col>
          <h1>Блогеры зарабатывают</h1>
          <p>
          В 2014 основатели Reddit предположили, что их площадка будет улучшена, если часть доходов будет возвращаться пользователям. Схема распределения была непрозрачной, не вызывала доверия, и так и не была принята сообществом. С приходом новой технологии такой подход стал осуществимым.
На viboard авторы получают свою долю за видео, а зрители - за комментарии и оценки.
          </p>
        </b-col>
      </b-row>
      
      <b-row id="row3">
        <b-col>
          <img src="./assets/adblock.jpg">
        </b-col>
        <b-col>
          <h1>Пользователи свободны от рекламы</h1>
          <p>Монетизация через рекламу уходит в прошлое, теперь вам не придется видеть назойливые рекламные вставки, пока вы смотрите видео любимого блогера.
            Ценность каждого видеоролика определяется сообществом.
          </p>
        </b-col>
      </b-row>
      
      <b-row id="row4">
        <b-col lg=6 offset-lg=6>
          <h1>Концентрируйтесь на контенте.</h1>
          <p>
          Будучи свободным от рекламы, вы можете сосредоточиться на создании уникального контента.
          </p>
          <p>
           Только сообщество решает, что достойно внимания.
          </p>
          <p>
            <strong>Создавайте качественный контент, теперь у вас есть возможность!</strong>
          </p>
          <h4><b-link href="FAQ">Читать подробнее</b-link></h4>
        </b-col>
      </b-row>
      
      <b-row class="d-lg-none">
      <b-card id="register2" title="Регистрация">
        <b-alert variant="success" ref="reg_result_success">
          Отлично! Теперь подтвердите Email
        </b-alert>
        <b-alert variant="danger" ref="reg_result_fail">Ошибка</b-alert>
        <b-form>
          <b-form-group>
            <b-form-input v-model="reg_username" type="text" placeholder="Логин" name="login" required/>
          </b-form-group>
          <b-form-group>
            <b-form-input v-model="reg_email" type="text" placeholder="Email" name="email" required/>
          </b-form-group>
          <b-form-group>
            <b-form-input v-model=reg_password type="password" placeholder="Пароль" name="pswd" required/>
          </b-form-group>
          <b-button variant="primary" @click="register">Зарегистрироваться</b-button>

        </b-form>
 
        <h4 class="card-title">Войти через <a href="https://golos.io">golos.io</a></h4>
        <b-alert variant="success" ref="auth_result_success">
          Успешно
        </b-alert>
        <b-alert variant="danger" ref="auth_result_fail">Ошибка</b-alert>
        
        <b-form>
          <b-form-group>
            <b-form-input v-model="login_username" type="text" placeholder="Логин" name="login" required/>
          </b-form-group>
          <b-form-group>
            <b-form-input v-model="login_password" type="password" placeholder="Пароль" name="pswd" required/>
          </b-form-group>
          <b-button variant="dark" @click="login">Войти</b-button>
        </b-form>
        
        <b-button href="index" class="mt-3" variant="outline-primary">
         Продолжить без регистрации 
        </b-button>
      </b-card>
   </b-row>
    </b-container fluid>
  
  </div>
</template>

<script>
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'
  import 'vue-plyr/dist/vue-plyr.css';
  import BootstrapVue from 'bootstrap-vue'
  import Vue from 'vue'
  
  var golos = require("golos-js");
  var Cookies = require('js-cookie');
  
  Vue.use(BootstrapVue);
  
  var prevScrollpos = window.pageYOffset;
  window.onscroll = function () {
    var currentScrollPos = window.pageYOffset;
    var distanceFromBottom = document.body.scrollHeight - window.innerHeight - window.scrollY
    
    if (prevScrollpos < 100 || distanceFromBottom < 200) {
      document.getElementById("sidebar").style.left = "0";
    } else {
      document.getElementById("sidebar").style.left = "-50%";
    }
    prevScrollpos = currentScrollPos;
  };
  
  function ShowSidebar() {
    document.getElementById('sidebar').style.display = "block";
  }
  
  export default {
    name: 'Landing',
    data: function () {
      return {
        reg_username: "",
        reg_email: "",
        reg_password: "",
        
        login_username: "",
        login_password: "",
      }
    },

    created: function() {
      if (Cookies.get("login")) {
        window.location.href = 'index'
      }
    },
    
    methods: {
      register: function (evt) {
        evt.preventDefault();
        let vm = this;
        vm.$refs.reg_result_fail.show = false;
        vm.$refs.reg_result_success.show = false;
        let new_account_name = vm.reg_username;
        let email = vm.reg_email; 
        let pswd = vm.reg_password;
        let beta_key = "1337";


        //check correct
        let accounts = [new_account_name];
        golos.api.getAccounts(accounts, function (err, result) {
          if (!err) {
            if (!result.length) {
              let newKeys = golos.auth.generateKeys(new_account_name, pswd, ['owner', 'active', 'posting', 'memo']);
              console.log('newKeys:', newKeys);

              let xhr = new XMLHttpRequest();
              xhr.open("POST", "https://viboard.me:3000", true);
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
                    vm.message = "Отлично! Теперь подтвердите e-mail";
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
        
        // request.post({url:'https://viboard.me:3000/', form: {my_key:'edited_value'}}, function(err,httpResponse,body){ /* ... */ })
      },
      
      login() {
        var vm = this;
        vm.$refs.auth_result_fail.show = false;
        vm.$refs.auth_result_success.show = false;
        var login = vm.login_username;
        var password = vm.login_password;
        
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
                window.location.href = 'index'
              } else {
                console.log(123);
                vm.$refs.auth_result_success.show = false;
                vm.$refs.auth_result_fail.show = true;
              }
            });
          }
          else console.error(err);
        });
      }
    }
  }
</script>


<style>
  
  #sidebar {
    line-height: 26px;
    overflow: auto;
    
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 50%;
    transition: left 0.5s;
    float: left;
    z-index: 1000;
  }
  
  #register {
    margin: 5% 25% 0% 25%;
    height: 85%;
    background: white;
    
    position: center;
    box-sizing: border-box;
    padding: 1%;
    width: 50%;
  }

  #register2 {
    background: white;
    
    position: center;
    box-sizing: border-box;
    padding: 1%;
    width: 90%;
  }
  
  .topbar {
    float: right;
    margin-left: 50%;
    width: 50%;
    padding-top: 40px;
    display: block;
  }
  
  .login {
    color: white;
    background-color: blue;
    float: right;
    margin-right: 10%;
  }
  
  #main {
    margin-top: 5%;
  }
  
  .row {
    padding: 10%;
    height: 100%;
  }

  b-row {
    color: white;
  }
</style>
