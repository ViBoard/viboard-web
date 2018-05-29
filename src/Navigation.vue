<template>
    <div id="navigation">
        <b-navbar toggleable="lg" fixed="top" class="bg-white" id="header">
          <b-container>
            <b-navbar-brand href="/" id="logo">
                <img height="40" src="./assets/logo.jpg">
            </b-navbar-brand>
               <b-collapse is-nav id="nav_collapse" v-if="logged_in">
                <b-navbar-nav>
                    <b-navbar-brand :href="link">
                        <img :src="imglogo" height="30" id="avatar-nav" class="rounded-circle">
                    </b-navbar-brand>
                    <b-nav-item vertical class="w-100">
                        <a><span id="nickname" @click="nickname_click">{{login}}</span></a>
                        <div class="video-total"><b>{{ total }}</b></div>
                    </b-nav-item>
                </b-navbar-nav>
                <b-navbar-nav class="ml-auto">
                    <b-button class="nav-button" variant="outline-primary" href="/upload"> Загрузить видео на golos.io </b-button>
                    <b-button class="nav-link" variant="link" @click="signout"> Выйти </b-button>
                </b-navbar-nav>
              <div v-for="item in SideLinksList" class="d-lg-none">
                <a class="nav-link text-dark" :href="item.href">
                    <i :class="item.icon"></i> {{ item.text }}
                </a>
              </div>
              <div cols="9" v-for="item in SubsList" class="d-lg-none">
                <a class="nav-link text-dark sub" :href="item.href">
                  {{ item.text }}
                </a>
              </div>            
            </b-collapse>
            <b-collapse is-nav id="nav_collapse" v-else>
                <b-navbar-nav class="ml-auto">
                    <b-button class="nav-button" variant="outline-primary" v-b-modal.login_modal> Загрузить видео на golos.io </b-button>
                    <b-button class="nav-link" variant="link" v-b-modal.signup_modal>Регистрация</b-button>
                    <b-button class="nav-link" variant="link" v-b-modal.login_modal>Войти</b-button>
                </b-navbar-nav>
              <div v-for="item in SideLinksList" class="d-lg-none">
                <a class="nav-link text-dark" :href="item.href">
                    <i :class="item.icon"></i> {{ item.text }}
                </a>
              </div>
            </b-collapse>
            <b-navbar-toggle class="ml-auto" id="navbar-toggler" target="nav_collapse"></b-navbar-toggle>

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
          </b-container>
            
        </b-navbar>
        <b-container id="app-container">
          <b-row>
            <b-col cols="3" class="d-none d-lg-block" id="side-col">
              <div v-for="item in SideLinksList">
                <a class="nav-link text-dark" :href="item.href">
                    <i :class="item.icon"></i> {{ item.text }}
                </a>
              </div>
              <div cols="9" v-for="item in SubsList">
                <a class="nav-link text-dark sub" :href="item.href">
                  {{ item.text }}
                </a>
              </div>
            </b-col>
            <b-col>
              <slot>

              </slot>
            </b-col>
          </b-row>
        </b-container>
    </div>
</template>

<script>
    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    import 'vue-plyr/dist/vue-plyr.css'
    import BootstrapVue from 'bootstrap-vue'
    import fontawesome from '@fortawesome/fontawesome'
    import faHome from '@fortawesome/fontawesome-free-solid/faHome'
    import faFire from '@fortawesome/fontawesome-free-solid/faFire'
    import faTrophy from '@fortawesome/fontawesome-free-solid/faTrophy'
    import faUser from '@fortawesome/fontawesome-free-solid/faUser'

    import RegistrationForm from './RegistrationForm.vue'
    import LoginForm from './LoginForm.vue'

    fontawesome.library.add(faHome)
    fontawesome.library.add(faFire)
    fontawesome.library.add(faTrophy)
    fontawesome.library.add(faUser)
    let golos = require("golos-js")
    let Cookies = require('js-cookie')
    golos.config.set('websocket', 'wss://ws.golos.io')
    import Vue from 'vue'

    Vue.use(BootstrapVue)

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
                    //{id: 2, text: 'Выбор редакции', href: '#', icon: 'fas fa-fw fa-trophy'},
                ],
                SubsList: [],
                reg_loading: false,
                reg_finished: false,
                link: "",
                total: "",
                imglogo: "../data/ava.png",
            }
        },

        created: function () {
            let temp_login = Cookies.get("login")
            let vm = this

            if (temp_login) {
                vm.login = temp_login
                vm.link = "/personal?author=" + temp_login
                vm.logged_in = true


                golos.api.getFollowing(temp_login, '', null, 100, function (err, result) {
                    if (!err) {
                        let id = 0
                        vm.SideLinksList.push({id: 3, text: "Подписки", href: "", icon: 'fas fa-fw fa-user'})
                        result.forEach(function (item) {
                            if (item['what'][0] === 'blog') {
                                vm.SubsList.push({
                                    id: id,
                                    text: item['following'],
                                    href: '/personal?author=' + item['following'],
                                })
                            }
                        })
                    }
                    else console.error("ОШИБКА АПИ ПРИ ПОЛУЧЕНИИ ПОДПИСОК", err)
                })

                golos.api.getAccounts([temp_login], function (err, result) {
                    if (!err) {
                        vm.total = result[0]['balance']
                        result.forEach(function (item) {
                            if (item['json_metadata'] !== "") {
                                function tryAva(URL) {
                                    let tester = new Image()
                                    tester.onerror = AvaNotFound()
                                    tester.src = URL
                                }

                                function AvaNotFound() {
                                    vm.imglogo = "../data/ava.png"
                                }

                                let obj = JSON.parse(item['json_metadata'])
                                if (obj['profile']['profile_image'] !== undefined) {
                                    if (obj['profile']['profile_image'] !== "") {
                                        try {
                                            tryAva(obj['profile']['profile_image'])
                                            vm.imglogo = obj['profile']['profile_image']
                                        }
                                        catch (e) {
                                            console.log("ОШИБКА ЗАГРУЗКА АВАТАРКИ", e)
                                        }
                                    }
                                }
                            }
                        })
                    }
                    else console.error("ОШИБКА АПИ ПРИ ПОЛУЧЕНИИ ДАННЫХ ПОЛЬЗОВАТЕЛЯ", err)
                })
            }
        },

        methods: {
            call_register: function (evt) {
                var vm = this
                if (!vm.reg_finished) {
                    vm.reg_loading = true
                    evt.preventDefault()
                    vm.$refs.registration_form.register()
                }
            },

            register_success: function () {
                var vm = this
                vm.$refs.signup_modal.busy = false
                vm.reg_loading = false
                vm.reg_finished = true
            },

            register_fail: function () {
                var vm = this
                vm.reg_loading = false
                vm.reg_ok_title = "Зарегистрироваться"
            },

            call_login: function (evt) {
                evt.preventDefault()
                var vm = this
                vm.$refs.login_form.login()
            },

            login_success: function () {
                var vm = this
                vm.$refs.login_modal.hide()
                vm.logged_in = true
                vm.login = Cookies.get("login")
            },

            signout: function () {
                Cookies.remove("login")
                Cookies.remove("posting_private")
                this.logged_in = false
            },

            nickname_click: function () {
                var videolist = document.getElementsByClassName("videofoo")
                console.log("wqefsgdfd")
                for (var i = 0; i < videolist.length; i++) {
                    videolist[i].style.height = 9 / 16 * videolist[i].offsetWidth
                    console.log(videolist[i].style.height, videolist[i].offsetWidth)
                }
            },
        },
    }
</script>

<style>
    #logo {
        position: fixed;
        left: 50%;
        top: 12px;
        transform: translateX(-50%);
    }

    #app-container {
        margin-top: 5em;
    }

    #side-col {
      margin-top: 1em;
    }

    .fas {
        margin-right: 3em;
    }

    #header {
        -webkit-box-shadow: 0px 1px 5px 0px rgba(136, 136, 136, 0.2);
        -moz-box-shadow: 0px 1px 5px 0px rgba(136, 136, 136, 0.2);
        box-shadow: 0px 1px 5px 0px rgba(136, 136, 136, 0.2);
        height: 70px;
    }

    .nav-button {
        margin-right: 1em;
    }v

    #subs {
        margin-left: 0.7em;
    }

    .sub {
        padding-top: 0em;
    }

    #avatar-nav {
        width: 50px;
        height: 50px;
        margin-left: 10px;
    }

    .sign {
        border-radius: 10px;
        border: 1.5px solid #D8D8D8;
        padding: 8px;
        padding-left: 30px;
        padding-right: 30px;
    }

    #navbar-toggler {
      position: fixed;
      top: 1em;
      right: 2em;
    }

    

    @media (max-width: 992px) {
     #nav_collapse {
        background-color: #fff;
        position: fixed;
        top: 0;
      }
    }

</style>
