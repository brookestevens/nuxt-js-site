<template>
  <div>
    <b-form @submit="handleLoginSubmit">
      <label class="sr-only" for="login-email">Email</label>
      <b-input v-model="email" id="login-email" type="email" class="mb-2 mr-sm-2 mb-sm-0" placeholder="Email"></b-input>

      <label class="sr-only" for="login-password">Password</label>
      <b-input v-model="password" id="login-password" type="password" placeholder="Password"></b-input>
      <br />
      <b-button variant="primary" type="submit" value="Submit">Login</b-button>
    </b-form>
    <b-button @click="handleClick" variant="primary" value="Create New">Create an Account</b-button>
    <b-button variant="primary" value="Forgot" disabled>Forgot Password?</b-button>
  </div>
</template>

<script>
export default {
  name: "LoginForm",
  data: function() {
    return {
      email: null,
      password: null
    };
  },
  mounted: function() {
    console.log("mounted login form");
  },
  methods: {
    verifyData: function(data){
      let d = Object.getOwnPropertyNames(data);
      for(let i = 0; i< d.length; i++){
        if(data[d[i]] === null || data[d[i]] === ""){
          return false;
        }
      }
      return true;
    },
    handleLoginSubmit: function(e) {
      e.preventDefault();
      if(this.verifyData({ email: this.email, password: this.password })){
        this.$store.dispatch("login", { email: this.email, password: this.password })
        .then(res => {
          if(res){
            this.$router.push('dashboard')
          }
          else{
            alert("Login Failed, check credentials");
          }
        }).catch(err => console.log("Error in login: ", err));
      }
      else{
        alert("Please fill out of the fields");
      }
    },
    handleClick: function() {
      this.$router.push('register');
    }
  }
};
</script>

<style>
</style>
