<template>
  <div class="page-container">
    <h2> My Settings </h2>
    <hr/>
    <form @submit="handleSave">
        Username <b-form-input v-model="form.username" placeholder="Username"></b-form-input>
        <br/>
        Interval to Work on Tasks <b-form-input v-model="form.timeInt" type="number" min="25" max="60" ></b-form-input>
        <br/>
        Daily Nibble Goal <b-form-input v-model="form.goal" type="number" min="1" max="60" ></b-form-input>
        <br/>
        <b-button type="submit"> Save </b-button>
    </form>

  </div>
</template>

<script>
export default{
  name: "user-settings",
  data: function(){
    return{
      form:{
        username: null,
        timeInt: null, //save this
        goal: null
      }
    }
  },
  mounted: function(){
    fetch('/api/getUserSettings').then(res => res.json())
    .then(res => {
      this.form.username = res.data.user_name;
      this.form.timeInt = res.data.time_interval;
      this.form.goal = res.data.tasks_required;
    })
    .catch(err => console.err(err))
  },
  methods:{
    handleSave: function(e){
      e.preventDefault();
      if(!this.form.username || !this.form.timeInt || !this.form.goal){
        alert('Please fill out all the fields! ');
        return;
      }
      this.$store.dispatch('updateSettings', {...this.form});
    }
  }
}
</script>

<style>

</style>
