<template>
  <div>
    <div id="header-info">
      <h2> {{new Date().toDateString()}} </h2>
      <b-button @click="$router.push('/addTask')" variant="outline-primary"> Add Meal! </b-button>
    </div>
    <hr>
    <div class="dashboard-grid">
      <div class="grid-child-a">
        <template v-if="todos.length > 0"> 
          <template v-for="i in todos">
              <b-card :key="i.id" :title="i.name" :class="`priority-${i.priority}`" >
                <img @click="showSubTasks(i)" class="edit-todo-icon" src="/images/edit_button.png" alt="FML"/>
              </b-card>
          </template>
        </template>
        <div v-else>
          <p> It looks like you font have any Meals (tasks) to work on yet. Try Making one by clicking on the "Add Task! Button" in the upper right hand corner </p>
        </div>
      </div>
      <div class="grid-child-b">
        <img id="mochi-sleeping" src="/images/mochi-sleeping.png" alt="please put this poor dev out of their misery " >
        <h4> Mochi needs 7 nibbles today </h4>
        <div id="task-actions">
          <b-button variant="outline-primary">Change number of Nibbles</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  name: "Dashboard",
  created: function(){
    fetch(`/api/validate`)
    .then(res => res.json())
    .then(res => {
      if(res.status === 1 ){
        this.$store.dispatch("getAllTodos");  //get all of the todos
      }
      else{
        this.$router.push('/');
      }
    }).catch(err => {
      console.log(err);
    })
  },
  computed: {
    todos(){
      return this.$store.state.todos;
    }
  },
  methods:{
    showSubTasks: function(todo){
      //NOt using dynamic routes cause of `nuxt generate`
      this.$store.dispatch('setCurrentItem', todo)
      .then(() => this.$router.push('/editTask'))
      .catch(err => console.error(err));
    }
  }
}
</script>

<style scoped lang="scss">
.dashboard-grid{
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: auto;
  grid-template-areas: 
    "list edit"
    "list edit"
}
.grid-child-a{
    grid-area: list;
}
.grid-child-b{
  grid-area: edit;
  h4{
    text-align: center;
  }
}
#mochi-sleeping{
  width: 80%;
  height: auto; 
}
#task-actions{
  display: flex;
  justify-content: space-around;
}
#header-info{
  display: flex;
  justify-content: space-between;
  margin-top: 1em;
}
.edit-todo-icon{
  width: 25px;
  height: auto;
  float: right;
}
.edit-todo-icon:hover{
  cursor: pointer;
}
@media only screen and (max-width: $phone){
  .dashboard-grid{
    grid-template-columns: 100%;
    grid-template-areas: 
      "edit"
      "list"
  }
}
</style>
