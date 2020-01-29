<template>
  <div class="container">
    <OnlineStatus/>
    <h2> {{new Date().toDateString()}} </h2>
    <hr>
    <div class="dashboard-grid">
      <div class="grid-child-a"> 
        <template v-for="i in todos">
          <div :key="i.id" class="todo-container" >
            <p class="see-more" @click="handleClick(i.id)"> See More </p>
            <!-- send an id to the sub tasks to hide  -->
            <TodoTree :childrenId="i.id" :todo="i"/>
          </div>
        </template>
      </div>
      <div class="grid-child-b"> <AddTodo/> </div>
    </div>
  </div>
</template>

<script>
import TodoTree from "../components/TodoTree";
import AddTodo from "../components/AddTodo";
import OnlineStatus from "../components/OnlineStatus";
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
  methods:{
    handleClick: function(id){
      //toggle the class to hide/show the sub tasks
      document.getElementById(id).classList.toggle('show-list');
    }
  },
  components: {TodoTree, AddTodo, OnlineStatus}
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
.todo-container{
  border: 1px solid black;
  border-radius: 1em;
  padding: 1em;
  margin-bottom: 1em;
  width: 70%;
}
.see-more{
  text-decoration: underline;
}
.see-more:hover{
  color: blue;
}
</style>
