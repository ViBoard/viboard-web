<template>
  <div @register="register">
    <b-alert variant="success" ref="success">
      Отлично! Теперь подтвердите Email
    </b-alert>
    <b-alert variant="danger" ref="fail" is-valid="true">{{ message }}</b-alert>
    <b-form>
      <b-form-group>
        <b-form-input v-model="username" 
                      type="text" 
                      placeholder="Логин" 
                      @input="validate_username()"
                      :class="{ 'is-invalid': username_is_invalid, 'is-valid': username_is_valid  }" 
                      required/>
        <div class="invalid-feedback">
          {{ username_feedback }}
        </div>
      </b-form-group>
      <b-form-group>
        <b-form-input v-model="email" 
                      type="text" 
                      placeholder="Email" 
                      @input="validate_email()"
                      :class="{ 'is-invalid': email_is_invalid, 'is-valid': email_is_valid  }"
                      required/>
        <div class="invalid-feedback">
          {{ email_feedback }}
        </div>
      </b-form-group>
      <b-form-group>
        <b-form-input v-model=password 
                      type="password" 
                      placeholder="Пароль" 
                      @input="validate_password()"
                      :class="{ 'is-invalid': password_is_invalid, 'is-valid': password_is_valid  }"
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
        email: "",
        password: "",
        message: "",
        username_is_valid: false,
        username_is_invalid: false,
        username_feedback: "",
        email_is_valid: false,
        email_is_invalid: false,
        email_feedback: "",
        password_feedback: "",
        password_is_valid: false,
        password_is_invalid: false,
        password_feedback: "",
      }
    },

    methods: {
      validate_username: function() {
        var allowed_symbols = /^[a-z0-9]*$/
        var starts_with_letter = /^[a-z].*$/
        var vm = this;
        vm.username_feedback = ""

        if (!vm.username.length) {
          vm.username_feedback = 'Логин не может быть пустым';
        } else if (vm.username.length < 3) {
          vm.username_feedback = 'Логин не может быть короче трёх символов';
        } else if (!allowed_symbols.test(vm.username)) {
          vm.username_feedback = 'Логин должен состоять из строчных латинских букв и цифр';
        } else if (!starts_with_letter.test(vm.username)) {
          vm.username_feedback = 'Логин должен начинаться с буквы';
        } else {
          let accounts = [vm.username];
          golos.api.getAccounts(accounts, function (err, result) {
            if (!err && result.length) {
              vm.username_feedback = 'Логин занят';
              vm.username_is_valid = false;
              vm.username_is_invalid = true;
            }
          });
        }

        if (vm.username_feedback) {
          vm.username_is_valid = false;
          vm.username_is_invalid = true;
        } else {
          vm.username_is_valid = true;
          vm.username_is_invalid = false;
        }
      },

      validate_email: function() {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var vm = this;

        if (re.test(vm.email)) {
          vm.email_is_valid = true;
          vm.email_is_invalid = false;
          vm.email_feedback = ""
        } else {
          vm.email_is_valid = false;
          vm.email_is_invalid = true;
          vm.email_feedback = "Неверный адрес"
        }
      },

      validate_password: function() {
        var vm = this;

        if (vm.password.length >= 6) {
          vm.password_is_valid = true;
          vm.password_is_invalid = false;
          vm.password_feedback = ""
        } else {
          vm.password_is_valid = false;
          vm.password_is_invalid = true;
          vm.password_feedback = "Не менее 6 символов"
        }
      },

      register: function (evt) {
        let vm = this;
        vm.validate_username()
        vm.validate_email()
        vm.validate_password()
        if (vm.username_is_invalid || vm.email_is_invalid || vm.password_is_invalid) {
          vm.$emit('register_fail');
          return;
        }
        vm.$refs.fail.show = false;
        vm.$refs.success.show = false;

        let newKeys = golos.auth.generateKeys(vm.username, vm.password, ['owner', 'active', 'posting', 'memo']);
        let xhr = new XMLHttpRequest();
        try {
          xhr.open("POST", "https://viboard.me:3000", true);
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          let send_req = "purpose=add&new_account_name=" + vm.username + "&owner=" + newKeys.owner + "&active=" + newKeys.active
          + "&posting=" + newKeys.posting + "&memo=" + newKeys.memo + "&email=" + vm.email;
          xhr.send(send_req);
        } catch (err) {
            vm.$emit('register_fail');
            vm.$refs.fail.show = true;
            vm.message = "Произошла ошибка при отправке запроса"
        }
        xhr.onreadystatechange = function () {
          console.log("readyState:", xhr.readyState);
          // 4 = DONE
          if (xhr.readyState == 4) {
            console.log("answer:", xhr.responseText);
            if (xhr.responseText == "(0) Now confirm email") {
              vm.$emit('register_success');
              //vm.username = "";
              //vm.email = "";
              //vm.password = "";
              vm.username_is_invalid = false;
              vm.email_is_invalid = false;
              vm.password_is_invalid = false;
              vm.$refs.success.show = true;
              vm.$refs.fail.show = false;
              let roles = ['posting'];
              let keys = golos.auth.getPrivateKeys(vm.username, vm.password, roles);
              Cookies.set("posting_private", keys.posting);
            } else if (xhr.responseText == "(-1) Email already registered") {
              vm.email_is_valid = false;
              vm.email_is_invalid = true;
              vm.$refs.fail.show = false;
              vm.email_feedback = "Аккаунт с этим адресом уже зарегистрирован";
              vm.$emit('register_fail');
            } else {
              vm.$emit('register_fail');
              vm.$refs.fail.show = true;
              console.log(xhr.responseText);
              vm.message = "Произошла ошибка при отправке запроса";
            }
          } else {
            vm.$emit('register_fail');
            vm.$refs.fail.show = true;
            vm.message = "Произошла ошибка при отправке запроса"
          }
        }
      },
    }
  }
</script>
