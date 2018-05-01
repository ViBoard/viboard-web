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
               :ok-title="reg_loading ? 'Загрузка...' : reg_finished ? 'OK' : 'Зарегистрироваться'"
               :busy="reg_loading"
               ok-variant="primary"
               @ok="call_register"
               cancel-variant="light"
               cancel-title="Отмена">
        <RegistrationForm ref="registration_form"
                          @register_success="register_success"
                          @register_fail="register_fail"/>
      </b-modal>
      
      <b-modal id="login_modal"
               ref="login_modal"
               title="Вход"
               ok-title="Войти"
               ok-variant="primary"
               @ok="call_login"
               cancel-variant="light"
               cancel-title="Отмена">
        <LoginForm ref="login_form"
                       @login_success="login_success"/>
      </b-modal>
    </b-navbar>
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

  import RegistrationForm from './RegistrationForm.vue'
  import LoginForm from './LoginForm.vue'
  
  fontawesome.library.add(faHome)
  fontawesome.library.add(faFire)
  fontawesome.library.add(faTrophy)
  let golos = require("golos-js");
  let Cookies = require('js-cookie');
  golos.config.set('websocket', 'wss://ws.golos.io');
  import Vue from 'vue'
  
  Vue.use(BootstrapVue);
  
  export default {
    name: 'Navigation',

    components: {
      RegistrationForm,
      LoginForm,
    },

    data: function () {
      return {
        logged_in: false,
        login: "",
        SideLinksList: [
          {id: 0, text: 'Главное', href: '/', icon: 'fas fa-fw fa-home'},
          {id: 1, text: 'Новое', href: 'new', icon: 'fas fa-fw fa-fire'},
          {id: 2, text: 'Выбор редакции', href: '#', icon: 'fas fa-fw fa-trophy'},
        ],
        reg_loading: false,
        reg_finished: false,
      }
    },
    
    created: function () {
      var temp_login = Cookies.get("login");
      let vm = this;
      if (temp_login) {
        vm.login = temp_login;
        vm.logged_in = true;
      }
    },
    
    methods: {
      call_register: function (evt) {
        var vm = this;
        if (!vm.reg_finished) {
          vm.reg_loading = true;
          evt.preventDefault();
          vm.$refs.registration_form.register();
        }
      },

      register_success: function() {
        var vm = this;
        vm.$refs.signup_modal.busy = false;
        vm.reg_loading = false;
        vm.reg_finished = true;
      },

      register_fail: function() {
        var vm = this;
        vm.reg_loading = false;
        vm.reg_ok_title = "Зарегистрироваться";
      },
      
      call_login: function(evt) {
        evt.preventDefault();
        var vm = this;
        vm.$refs.login_form.login();
      },

      login_success: function() {
        var vm = this;
        vm.$refs.login_modal.hide()
        vm.logged_in = true;
        vm.login = Cookies.get("login");
      },

      signout: function() {
        Cookies.remove("login");
        Cookies.remove("posting_private");
        this.logged_in = false;
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
