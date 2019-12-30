<template>
  <div class="container">
    <h2> Register </h2>
    <br/>
    <NewUserForm/>
  </div>
</template>

<script>
import NewUserForm from "../components/NewUserForm";

export default{
  name: "Register",
  components:{
    NewUserForm
  },
  layout: 'home'
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  text-align: center;
}
</style>
