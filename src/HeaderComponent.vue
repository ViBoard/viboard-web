<template>
  <div>
    <div id="header">
      <img id="logo" src="./assets/logo.jpg">
    </div>
    <div id="login-info">
        <div id="login">mmalikov</div>
        <div id='upload'>Загрузить</div>
        <div id="signout">Выйти</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderComponent',
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
}

#logo {
  display: block;
  width: 8em;
  margin-left: auto;
  margin-right: auto;
  padding-top: 1em;
  padding-bottom: 1em;
}

#login-info {
  display: block;
  position: fixed;
}
</style>
