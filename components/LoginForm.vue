<template>
  <div>
    <b-form @submit="handleLoginSubmit">
      <label class="sr-only" for="login-email">Email</label>
      <b-input v-model="email" id="login-email" class="mb-2 mr-sm-2 mb-sm-0" placeholder="Email"></b-input>

      <label class="sr-only" for="login-password">Password</label>
      <b-input v-model="password" id="login-password" type="password" placeholder="Password"></b-input>
      <br />
      <b-button variant="primary" type="submit" value="Submit">Login</b-button>
    </b-form>

    <b-button @click="handleClick" variant="primary" value="Create New">Create an Account</b-button>
    <b-button variant="primary" value="Forgot" disabled>Forgot Password?</b-button>

    <b-form @submit="handleNewAccountSubmit">
      <label class="sr-only" for="fname"> First Name</label>
      <b-input v-model="newUser.fname" id="fname" type="text" class="mb-2 mr-sm-2 mb-sm-0" placeholder="First Name"></b-input>
      
      <label class="sr-only" for="lname">Last Name</label>
      <b-input v-model="newUser.lname" id="lname" type="text" placeholder="Last Name"></b-input>  
      <br />
      
      <label class="sr-only" for="password">Password</label>
      <b-input v-model="newUser.password" id="password" type="password" placeholder="Password"></b-input>
      <br/>
      
      <label class="sr-only" for="email">Email</label>
      <b-input v-model="newUser.email" id="email" type="text" placeholder="Email"></b-input>
      
      <br/>
      <label class="sr-only" for="phone">Phone Number</label>
      <b-input v-model="newUser.phone" id="phone" type="text" placeholder="Phone Number"></b-input>
      
      <br/>
      <b-button variant="primary" type="submit" value="Submit">Submit</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "LoginForm",
  data: function() {
    return {
      email: null,
      password: null,
      newUser: {
        fname: null,
        lname: null,
        email: null,
        password: null,
        phone: null
      }
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
        this.$store.commit("LOGIN", { email: this.email, password: this.password });
      }
      else{
        alert("Please fill out of the fields");
      }
    },
    handleNewAccountSubmit: function(e){
      e.preventDefault();
      if(this.verifyData(this.newUser)){
        this.$store.commit("ADD_USER", this.newUser);
      }
      else{
        alert("Please fill out all of the fields");
      }

    },
    handleClick: function() {
      alert("making a new account!");
    }
  }
};
</script>

<style>
</style>
