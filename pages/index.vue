<template>
  <div class="login-wrapper">
  <h2> Nibble </h2>
  <div class="login-container">
    <div class="login-form-container">
      <h3> Sign In </h3>
      <b-form @submit="handleLoginSubmit">
        <label class="sr-only" for="login-email">Email</label>
        <b-input v-model="email" id="login-email" type="email" class="mb-2 mr-sm-2 mb-sm-0" placeholder="Email"></b-input>
        <br/>
        <label class="sr-only" for="login-password">Password</label>
        <b-input v-model="password" id="login-password" type="password" placeholder="Password"></b-input>
        <br/>
        <div class="login-buttons">
          <b-button pill variant="primary" type="submit" value="Submit">Login</b-button>
          <b-button pill variant="primary" type="button" disabled>Forgot Password?</b-button>
        </div>
      </b-form>
    </div>
    <div class="new-account-wrapper">
      <div class="new-account-container">
        <h1> Welcome! </h1>
        <h5> Sign up to start becoming more productive</h5>
        <b-button pill variant="outline-primary" @click="handleClick" value="Create New">Create an Account</b-button>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default{
  name: "LoginPage",
    data: function() {
    return {
      email: null,
      password: null
    };
  },
  mounted: function() {
    // if(localStorage.getItem('login') === 'true'){ //already logged in
    //   this.$router.push('dashboard');
    // }
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
  },
  layout: 'authenticate'
}
</script>

<style lang="scss" scoped>
  h2{
    color: $main-color;
  }
  h3{
    margin-top: 2em;
    text-align: center;
  }
  .login-wrapper{
    width: 65%;
    margin: auto;
    padding-top: 120px;
  }
  .login-container{
    display: flex;
    padding: 1em;
    box-shadow: 5px 5px 9px #e272726e;;
    border-radius: 4px;
    height: 450px;
  }
  .login-buttons{
    width: 60%;
    margin: auto;
    display: flex;
    justify-content: space-between;
  }
  .login-form-container{
    width: 50%;
    padding-right: 2em;
    border-right: 1px solid $main-color;
  }
  .new-account-wrapper{
    padding-left: 2em;
    padding-top: 10%;
  }
  .new-account-container{
    text-align: center;
    width: 70%;
    margin: auto;
  }
  @media only screen and (max-width: $phone){
    h1{margin-top: 1em;}
    h2{
      text-align: center;
      margin-top: 10%;
    }
    h3{
      margin-top: 0em;
    }
    .login-wrapper{
      width: 90%;
      padding-top: 0px;
    }
    .login-container{
      flex-direction: column;
      height: unset;
      box-shadow: none;
    }
    .login-form-container{
      width: unset;
      padding-right: 0px;
      border-right: none;
      .login-buttons{
        width: 80%;
      }
    }
    .new-account-wrapper{
      padding-left: 0px;
      .new-account-container{
        border-top: 10px solid black;
        margin-top: 1.5em;
      }
    }
  }
</style>
