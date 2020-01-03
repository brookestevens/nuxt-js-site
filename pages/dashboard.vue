<template>
  <div class="container">
    <h2> Tasks and stuff </h2>
    <hr>
    <div class="dashboard-grid">
      <div class="grid-child-a"> <TodoTree :todo="todos"/> </div>
      <div class="grid-child-b"> <AddTodo/> </div>
    </div>
  </div>
</template>

<script>
import TodoTree from "../components/TodoTree";
import AddTodo from "../components/AddTodo";
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
  mounted: function(){
    //set store to local storage
    this.$store.commit('LOGIN');
    this.$store.commit('DARK_MODE');
  },
  computed: {
    todos(){
      return this.$store.state.todos;
    }
  },
  components: {TodoTree, AddTodo}
}
</script>

<style>
.dashboard-grid{
  display: grid;
  grid-template-columns: 60% 40%;
  grid-template-rows: auto;
  grid-template-areas: 
    "list edit"
    "list edit"
}
.grid-child-a{grid-area: list}
.grid-child-b{grid-area: edit}
</style>
