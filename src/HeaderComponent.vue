<template>
  <div>
    <div id="header">
      <div id="logo-container">
        <img id="logo" src="./assets/logo.jpg">
      </div>
      <div id="account-info" v-if="logged_in">
          <a class="menu-bar" href="/upload"><div id="upload">Загрузить</div></a>
          <a class="menu-bar" href="#"><div id="nickname">mmalikov</div></a>
          <a class="menu-bar" href="#"><div id="signout" @click="signout">Выйти</div></a>
      </div>
      <div id="login-bar" v-if="!logged_in">
          <a class="menu-bar" href="#"><div id="signup" onclick="document.getElementById('signup_form').style.display='block'">Регистрация</div></a>
          <a class="menu-bar" href="#"><div id="signin" onclick="document.getElementById('signin_form').style.display='block'">Вход</div></a>
      </div>
    </div>

    <!-- The Modal (contains the Sign Up form) -->
    <div id="signup_form" class="modal">
      <span onclick="document.getElementById('signup_form').style.display='none'" class="close" title="Close Modal">&times;</span>
      <form class="modal-content">
        <div class="container">
          <h1>Регистрация</h1>

          <hr>
          <label for="login"><b>Логин</b></label>
          <input type="text" placeholder="Введите логин" name="login" required>

          <label for="email"><b>Email</b></label>
          <input type="text" placeholder="Введите Email" name="email" required>

          <label for="psw"><b>Пароль</b></label>
          <input type="password" placeholder="Введите пароль" name="psw" required>

          <label for="psw-repeat"><b>Повтор пароля</b></label>
          <input type="password" placeholder="Повторите пароль" name="psw-repeat" required>

          <!-- <p>By creating an account you agree to our <a href="#" style="color:dodgerblue">Terms & Privacy</a>.</p> -->

          <div class="clearfix">
            <button type="button" onclick="document.getElementById('signup_form').style.display='none'" class="cancelbtn">Отменить</button>
            <button type="button" class="signupbtn">Создать аккаунт!</button>
          </div>
        </div>
      </form>
    </div>

    <!-- The Modal (contains the Sign In form) -->
    <div id="signin_form" class="modal">
      <span onclick="document.getElementById('signin_form').style.display='none'" class="close" title="Close Modal">&times;</span>
      <form class="modal-content">
        <div class="container">
          <h1>Вход на сайт</h1>
          <div class="control-group" id="auth_result_success" style="display: none; color: green">
    				Успешно
    			</div>
    			<div class="control-group" id="auth_result_fail" style="display: none; color: red">
    				Неверный логин/пароль
          </div>
          <hr>
          <label for="login"><b>Логин</b></label>
          <input id="login-name" type="text" placeholder="Введите логин" name="login" required>

          <label for="psw"><b>Пароль</b></label>
          <input id="login-pass" type="password" placeholder="Введите пароль" name="psw" required>

          <label>
            <input id="remember-me" type="checkbox" checked="unchecked" name="remember" style="margin-bottom:15px"> Запомнить
          </label>

          <div class="clearfix">
            <button type="button" onclick="document.getElementById('signin_form').style.display='none'" class="cancelbtn">Отменить</button>
            <button type="button" class="signupbtn" @click="auth">Войти!</button>
          </div>
        </div>
      </form>
    </div>
  </div>


</template>

<script>
var golos = require("golos-js");
require("./assets/cookie")
golos.config.set('websocket', 'wss://ws.golos.io');

export default {
  name: 'HeaderComponent',
  data: function() {
    return {
      logged_in: true,
    }
  },

  created: function() {
    // var modal1 = document.getElementById('signup_form');
    // // When the user clicks anywhere outside of the modal, close it
    // window.onclick = function(event) {
    //     if (event.target != modal1) {
    //         modal1.style.display = "none";
    //     }
    // }
  },

  methods: {
    signout: function() {
      this.logged_in = false;
    },

    signin: function() {
      this.logged_in = true;
    },

    signup: function() {
      this.logged_in = true;
    },

    auth: function() {
      var login = document.getElementById("login-name").value;
      var password = document.getElementById("login-pass").value;
      var remember_me = document.getElementById("remember-me").checked;

      var roles = ['posting'];
      console.log(login, password, remember_me);
      var keys = golos.auth.getPrivateKeys(login, password, roles);
      console.log('postingPubkey', keys['postingPubkey']);

      var auths = {
        posting: [[keys['postingPubkey']]]
      };

      var verifyResult = golos.auth.verify(login, password, auths);
      console.log('verify', verifyResult);

      if(verifyResult){
        document.getElementById("auth_result_success").style.display = "block";
        document.getElementById("auth_result_fail").style.display = "none";
        setCookie("login", login, {});
        setCookie("password", password, {});
        setCookie("post_password", post_password, {});
        setCookie("priv_post_password", priv_post_password, {});
        setTimeout('window.location = "index.html"',1000);
      } else{
        document.getElementById("auth_result_success").style.display = "none";
        document.getElementById("auth_result_fail").style.display = "block";
      }
    }
  }
}
</script>

<style>
#header {
  position: fixed;
  width: 100%;
  top: 0px;
  background: #fff;
  -webkit-box-shadow: 0px 1px 5px 0px rgba(136,136,136,0.2);
  -moz-box-shadow: 0px 1px 5px 0px rgba(136,136,136,0.2);
  box-shadow: 0px 1px 5px 0px rgba(136,136,136,0.2);
  overflow: hidden;
}

#logo {
  display: block;
  width: 8em; /*8em was*/
  margin-left: auto;
  margin-right: auto;
  padding-top: 1em;
  padding-bottom: 1em;
}

#account-info, #login-bar {
  position: fixed;
  right: 1em;
  top: 2em;
}

#account-info div, #login-bar div {
  margin-right: 2em;
  display:inline-block;
}

.menu-bar {
  color: black;
}

* {box-sizing: border-box}
/* Full-width input fields */
  input[type=text], input[type=password] {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  display: inline-block;
  border: none;
  background: #f1f1f1;
}

/* Add a background color when the inputs get focus */
input[type=text]:focus, input[type=password]:focus {
  background-color: #ddd;
  outline: none;
}

/* Set a style for all buttons */
button {
  background-color: #292929; /*#4CAF50*/
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
  opacity: 0.9;
}

button:hover {
  opacity:1;
}

/* Extra styles for the cancel button */
.cancelbtn {
  padding: 14px 20px;
  background-color: #ABABAB; /*#f44336*/
  color: black;
}

/* Float cancel and signup buttons and add an equal width */
.cancelbtn, .signupbtn {
  float: left;
  width: 50%;
}

/* Add padding to container elements */
.container {
  padding: 16px;
}

/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgba(71, 78, 93, 0.7);
  padding-top: 50px;
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 3% auto 15% auto; /* 5% from the top, 15% from the bottom and centered */
  border: 1px solid #888;
  width: 30%; /* Could be more or less, depending on screen size */
}

/* Style the horizontal ruler */
hr {
  border: 1px solid #f1f1f1;
  margin-bottom: 25px;
}

/* The Close Button (x) */
.close {
  position: absolute;
  right: 35px;
  top: 15px;
  font-size: 40px;
  font-weight: bold;
  color: #f1f1f1;
}

.close:hover,
.close:focus {
  color: #f44336;
  cursor: pointer;
}

/* Clear floats */
.clearfix::after {
  content: "";
  clear: both;
  display: table;
}

/* Change styles for cancel button and signup button on extra small screens */
@media screen and (max-width: 300px) {
  .cancelbtn, .signupbtn {
    width: 100%;
  }
}
</style>
