<template>
  <div class="container">
    <h2> Nibble! </h2>
    <br/>
    <LoginForm/>
  </div>
</template>

<script>
import LoginForm from "../components/LoginForm";

export default{
  name: "LoginPage",
  components:{
    LoginForm
  },
  layout: 'authenticate'
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  text-align: center;
}
</style>
