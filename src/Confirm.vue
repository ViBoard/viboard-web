<template>
  <div id="app">
    <Navigation/>
    <AppInner>
      <b-col lg=8 offset-lg=2>
        <div id="confirm-div"></div>
      </b-col>
    </AppInner>
  </div>
</template>

<script>
  var buffer = require("buffer");
  var ipfsAPI = require("ipfs-api");
  var golos = require("golos-js");
  var Cookies = require('js-cookie');
  var queryString = require('query-string');
  import Navigation from './Navigation.vue'
  import AppInner from './AppInner.vue'
  
  export default {
    name: 'app',
    components: {
      Navigation,
      AppInner,
    },
    
    data: function () {
      return {
        login: "",
        code: "",
      }
    },
    
    created: function () {
      let vm = this;
      let queries = queryString.parse(location.search);
      vm.login = queries.name;
      vm.code = queries.code;
      console.log(vm.login, vm.code);
      
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "https://viboard.me:3000", true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      let send_req = "purpose=confirm&new_account_name=" + vm.login + "&confirm_key=" + vm.code;
      xhr.send(send_req);
      xhr.onreadystatechange = function () {
        console.log("readyState:", xhr.readyState);
        // 4 = DONE
        if (xhr.readyState == 4) {
          console.log("answer:", xhr.responseText);
          if (xhr.responseText == "(0) Created") {
            document.getElementById("confirm-div").innerHTML = "Подтверждено! Аккаунт создан";
            Cookies.set("login", vm.login);
            setTimeout(window.location.replace("index"), 1000);
            //   vm.$refs.reg_result_success.show = true;
            //   vm.$refs.reg_result_fail.show = false;
            //   Cookies.set("login", new_account_name);
            //   Cookies.set("posting_private", newKeys.posting);
            //   setTimeout(function () {
            //     vm.$refs.signup_modal.hide()
            //   }, 500);
            //   vm.login = new_account_name;
            //   vm.logged_in = true;
            // } else {
            //   vm.$refs.reg_result_success.show = false;
            //   vm.$refs.reg_result_fail.show = true;
          } else if(xhr.responseText == "(-1) No data in DB") {
            document.getElementById("confirm-div").innerHTML = "Ошибка. Аккаунт уже подтвержден, либо срок действия ссылки истёк";
          }
        }
      }
    },
    
    methods: {}
  }
</script>
