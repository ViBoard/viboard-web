<template>
  <div id=container>
    <b-navbar class="d-none d-lg-block" id="sidebar"> 
      <b-card id="register" title="Регистрация">
        <b-alert variant="danger" ref="reg_result_fail">Ошибка</b-alert>
        <b-form>
          <b-form-group>
            <b-form-input v-model="reg_username" type="text" placeholder="Логин" name="login" required/>
          </b-form-group>
          <b-form-group>
            <b-form-input v-model="reg_email" type="text" placeholder="Email" name="email" required/>
          </b-form-group>
          <b-button variant="primary">Оставить заявку</b-button>
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
          Попробовать сейчас 
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
            <b-row>
                <b-col lg=6 offset-lg=6>
                    <h1>Новый взгляд на ваши видео</h1>
                    <p>Популярные сервисы уходят в прошлое, наступает время блокчейна. Только так можно обеспечить равенство, справедливость и открытость</p>
                </b-col>
            </b-row>

            <b-row>
                <b-col>
                    <img src="./assets/shutup.gif">
                </b-col>
                <b-col>
                    <h1>Здесь блогеры зарабатывают</h1>
                    <p>В 2014 основатели Reddit решили разделить часть доходов между пользователям. 
                    Cхема распределения была непрозрачной, не вызывала доверия, и так и не была принята сообществом. 
                    С приходом новых технологий такой подход стал возможным. В системе viboard авторы получают свою долю за размещение 
                    видео, а зрители — за комментарии и оценки.</p>
                    <p> Выплаты происходят в криптовалюте GBG со стабильным курсом и легко переводятся в реальные деньги. </p>
                </b-col>
            </b-row>

            <b-row>
                <b-col>
                    <img src="./assets/adblock.jpg">
                </b-col>
                <b-col>
                    <h1>Пользователи свободны от рекламы</h1>
                    <p>Монетизация через рекламу уходит в прошлое, и больше не нужно терпеть рекламу казино и онлайн-игр</p>
                    <p>Ценность видео определяется сообществом, а не рекламодателем. Участники получают выплаты в валюте, стоимость которой
                    прямо связана с популярностью площадки и качеством контента.</p>
                </b-col>
            </b-row>

            <b-row>
                <b-col lg=6 offset-lg=6>
                    <h1>Концентрируйтесь на контенте.</h1>
                    <p>Вам больше не нужно вставлять рекламу казино и онлайн игр. Наша система выплачивает авторам вознаграждение, если их видео кому-то нравятся
                        Ваш рейтинг влияет на место нового видео в топе, таким образом вложив свой рейтинг в новый выпуск своей рубрики, можно вывести его на главную, не прибегая к рекламе
                    </p>
                </b-col>
            </b-row>

            <b-row class="d-lg-none">
              <b-card title="Регистрация" style="width: 100%">
                <b-alert variant="danger" ref="reg_result_fail">Ошибка</b-alert>
                <b-form>

                <b-form-group>
                  <b-form-input v-model="reg_username" type="text" placeholder="Логин" name="login" required/>
                </b-form-group>
                <b-form-group>
                  <b-form-input v-model="reg_email" type="text" placeholder="Email" name="email" required/>
                </b-form-group>
                <b-button variant="primary">Оставить заявку</b-button>
              </b-form>

              <h4 class="card-title">Войти через <a href="https://golos.io">golos.io</a></h4>

              <b-form>
                <b-form-group>
                  <b-form-input v-model="login_username" type="text" placeholder="Логин" name="login" required/>
                </b-form-group>
                <b-form-group>
                  <b-form-input v-model="login_password" type="password" placeholder="Пароль" name="pswd" required/>
                </b-form-group>
                <b-button @click="login" variant="primary">Войти</b-button>
              </b-form>

              <b-button href="index" class="mt-3" variant="outline-primary">
                Попробовать сейчас 
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
  window.onscroll = function() {
      var currentScrollPos = window.pageYOffset;
      var distanceFromBottom = document.body.scrollHeight - window.innerHeight - window.scrollY

      if (prevScrollpos < 100 || distanceFromBottom < 200 ) {
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

        login_username: "",
        login_password: "",
      }
    },

    methods: {
      register() {
      
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
                setTimeout(function() { vm.$refs.login_modal.hide() }, 500);
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
    margin: 5% 25% 5% 25%;
    height: 80%;
    background: white;

    position: center;
    box-sizing: border-box;
    padding: 1%;
    width: 50%;
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
}
</style>
