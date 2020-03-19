<template>
  <div class="container">
    <h2> Logged out! </h2>
    <b-button @click="handleClick" variant="primary">Log in</b-button>
  </div>
</template>

<script>
export default{
  name: "Logout",
  layout: 'authenticate',
  created: function(){
    fetch('/api/logout')
    .then(res => {
      console.log("logged out");
      this.$store.dispatch('logout');
    })
    .catch(err => console.log(err));
  },
  methods:{
    handleClick : function(){
      this.$router.push('/');
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  text-align: center;
}
</style>