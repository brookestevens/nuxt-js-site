<template>
  <div class="container">
    <h2>Register</h2>
    <br/>
    <b-form @submit="handleNewAccountSubmit">
      <label class="sr-only" for="fname">User Name</label>
      <b-input
        v-model="newUser.fname"
        id="fname"
        type="text"
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder="Username"
      ></b-input>
      <br />

      <label class="sr-only" for="password">Password</label>
      <b-input v-model="newUser.password" id="password" type="password" placeholder="Password"></b-input>
      <br />

      <label class="sr-only" for="email">Email</label>
      <b-input v-model="newUser.email" id="email" type="text" placeholder="Email"></b-input>

      <br />
      <label class="sr-only" for="phone">Phone Number</label>
      <b-input v-model="newUser.phone" id="phone" type="text" placeholder="Phone Number"></b-input>

      <br />
      <b-button variant="primary" type="submit" value="Submit">Submit</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "Register",
  data: function() {
    return {
      newUser: {
        fname: null,
        email: null,
        password: null,
        phone: null
      }
    };
  },
  methods: {
    verifyData: function(data) {
      let d = Object.getOwnPropertyNames(data);
      for (let i = 0; i < d.length; i++) {
        if (data[d[i]] === null || data[d[i]] === "") {
          return false;
        }
      }
      return true;
    },
    handleNewAccountSubmit: function(e) {
      e.preventDefault();
      if (this.verifyData(this.newUser)) {
        fetch('/api/addUser', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(this.newUser)})
        .then(res => res.json())
        .then(res => {
        if(JSON.parse(res.status) === 1){
          this.$router.push('dashboard');
        }
        else{
          alert("Error creating account");
        }
    })
    .catch(err => console.error("Error: ", err));
      } else {
        alert("Please fill out all of the fields");
      }
    }
  },
  layout: "authenticate"
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  text-align: center;
}
</style>
