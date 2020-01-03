<template>
  <div class="container">
    <h2> Logged out! </h2>
    <b-button @click="handleClick" variant="primary">Log in</b-button>
  </div>
</template>

<script>
export default{
  name: "Logout",
  layout: 'home',
  created: function(){
    fetch('/api/logout')
    .then(res => res.json()) 
    .catch(err => console.log(err));
  },
  mounted: function(){
    this.$store.commit('LOGOUT');
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