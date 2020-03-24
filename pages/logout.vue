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
      this.$store.dispatch('logout');
    })
    .catch(err => console.error(err));
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