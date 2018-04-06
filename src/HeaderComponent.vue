<template>
  <div>
    <div id="header">
      <div id="logo-container">
        <img id="logo" src="./assets/logo.jpg">
      </div>
      <div id="account-info" v-if="logged_in">
          <a class="menu-bar" href="#"><div id="upload">Загрузить</div></a>
          <a class="menu-bar" href="#"><div id="nickname">mmalikov</div></a>
          <a class="menu-bar" href="#"><div id="signout" @click="signout">Выйти</div></a>
      </div>
      <div id="login-bar" v-if="!logged_in">
          <a class="menu-bar" href="#"><div id="signup" onclick="document.getElementById('id01').style.display='block'">Регистрация</div></a>
          <a class="menu-bar" href="#"><div id="signin" @click="signin">Вход</div></a>
      </div>
    </div>

    <!-- The Modal (contains the Sign Up form) -->
    <div id="id01" class="modal">
      <span onclick="document.getElementById('id01').style.display='none'" class="close" title="Close Modal">&times;</span>
      <form class="modal-content">
        <div class="container">
          <h1>Регистрация</h1>
          <p id="signup_form_alerts"></p>
          <hr>
          <label for="login"><b>Логин</b></label>
          <input type="text" placeholder="Введите логин" name="login" required>

          <label for="email"><b>Email</b></label>
          <input type="text" placeholder="Введите Email" name="email" required>

          <label for="psw"><b>Пароль</b></label>
          <input type="password" placeholder="Введите пароль" name="psw" required>

          <label for="psw-repeat"><b>Повтор пароля</b></label>
          <input type="password" placeholder="Повторите пароль" name="psw-repeat" required>

          <label>
            <input type="checkbox" checked="checked" name="remember" style="margin-bottom:15px"> Запомнить
          </label>

          <p>By creating an account you agree to our <a href="#" style="color:dodgerblue">Terms & Privacy</a>.</p>

          <div class="clearfix">
            <button type="button" onclick="document.getElementById('id01').style.display='none'" class="cancelbtn">Отменить</button>
            <button type="button" class="signupbtn">Создать аккаунт!</button>
          </div>
        </div>
      </form>
    </div>
  </div>


</template>

<script>
export default {
  name: 'HeaderComponent',
  data: function() {
    return {
      logged_in: false,
    }
  },

  created: function() {
    // var modal1 = document.getElementById('id01');
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
  -webkit-box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.2);
  -moz-box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.2);
  box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.2);
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
  margin: 5% auto 15% auto; /* 5% from the top, 15% from the bottom and centered */
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
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
