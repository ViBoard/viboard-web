<template>
  <div>
    </b-alert>
    <b-alert variant="danger" ref="fail" is-valid="true">{{ message }}</b-alert>
    <b-form>
      <b-form-group>
        <b-form-input v-model="username" 
                      type="text" 
                      placeholder="Логин" 
                      :class="{ 'is-invalid': username_is_invalid }" 
                      required/>
        <div class="invalid-feedback">
          {{ username_feedback }}
        </div>
      </b-form-group>
      <b-form-group>
        <b-form-input v-model=password 
                      type="password" 
                      placeholder="Пароль" 
                      :class="{ 'is-invalid': password_is_invalid }"
                      required/>
        <div class="invalid-feedback">
          {{ password_feedback }}
        </div>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
  var golos = require("golos-js");
  var Cookies = require('js-cookie');
  export default {
    name: 'RegistrationForm',

    data: function () {
      return {
        username: "",
        password: "",
        message: "",
        username_is_invalid: false,
        username_feedback: "",
        password_feedback: "",
        password_is_invalid: false,
        password_feedback: "",
      }
    },

    methods: {
      login: function () {
        let vm = this;
        vm.$refs.fail.show = false;
        vm.username_is_invalid = false;
        vm.password_is_invalid = false;
        var login = vm.username;
        var password = vm.password;

        var accounts = [login];
        golos.api.getAccounts(accounts, function (err, result) {
          console.log(err, result);
          if (!err) {
            if (!result.length) {
              vm.username_is_invalid = true;
              vm.username_feedback = "Логин не найден";
              vm.$emit("login_fail");
            } else {
              result.forEach(function (item) {
                var postingPubkey = item.posting.key_auths[0][0];
                //console.log('getAccounts', item.posting); // Костыль?

                var auths = {
                  posting: [[postingPubkey]]
                };

                var verifyResult = golos.auth.verify(login, password, auths);
                console.log('verify', verifyResult);

                var roles = ['posting'];
                var keys = golos.auth.getPrivateKeys(login, password, roles);

                if (verifyResult) {
                  Cookies.set("login", login);
                  Cookies.set("posting_private", keys.posting);
                  vm.$emit("login_success");
                } else {
                  vm.password_is_invalid = true;
                  vm.password_feedback = "Неверный пароль";
                  vm.password = "";
                  vm.$emit("login_fail");
                }
              });
            }
          } else {
            vm.message = "Ошибка при отправке запроса";
            vm.$refs.fail.show = true;
            console.error(err);
          }
        });
      },
    }
  }
</script>
