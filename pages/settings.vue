<template>
  <div class="page-container">
    <h2> My Settings </h2>
    <hr/>
    <div>
        <b-form-input v-model="username" placeholder="Username"></b-form-input>
        <br/>
        <b-form-input v-model="timeInt" type="number" min="25" max="60" ></b-form-input>
        <b-button @click="handleSave"> Save </b-button>
    </div>

  </div>
</template>

<script>
export default{
  name: "user-settings",
  data: function(){
    return{
      username: null,
      timeInt: 25
    }
  },
  methods:{
    handleSave: function(){
      console.log("saving");
    }
  }
}
</script>

<style>

</style>
