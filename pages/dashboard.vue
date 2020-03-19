<template>
  <div>
    <div id="header-info">
      <h2 id="date-header"> {{new Date().toDateString()}} </h2>
      <b-button @click="$router.push('/addTask')" variant="outline-primary"> Add Meal! </b-button>
    </div>
    <hr>
    <div class="dashboard-grid">
      <div class="grid-child-a">
        <template v-if="todos.length > 0"> 
          <template v-for="i in todos">
              <b-card :key="i.id" :class="`priority-${i.priority}`" >
                <div class="name-kebob">
                  <!-- the main task -->
                  <b-form-input :id="`name-${i.index}`" @blur="handleUpdate($event, i)" class="edit-form-input" :value="i.name" placeholder="Task name"></b-form-input>
                  <div class="icons-actions">
                    <img class="todo-icon" @click="handleDelete(i.id)" src="/images/trash-can.png" alt="burn this app with fire"/>
                    <img class="todo-icon" @click="$root.$emit('bv::toggle::collapse', `collapse-${i.index}`)" src="/images/kebob-menu.png" alt="FML"/>
                  </div>
                </div>  
                  <b-collapse :id="`collapse-${i.index}`" class="mt-2">
                    <div v-if="i.children.length !== 0 && i.status === false">
                      <template v-for="j in i.children">
                          <!-- Render the Bites and nibbles -->
                          <TodoTree :taskID="i.id" :todo="j" :childrenId="j.id" :key="`subtask-${j.id}`" />
                      </template>
                    </div>
                    <!-- task is finished -->
                    <div v-else-if="i.status === true" class="task-finished">
                      <p> Task completed! </p>
                    </div>
                    <!-- only work the task if theres no bites/nibbles -->
                    <div v-else> 
                        <p>There are no bites for this task! </p>
                        <b-button variant="primary" @click="showTimerPage(i)"> Work on this task! </b-button>
                    </div>
                  </b-collapse>
              </b-card>
          </template>
        </template>
        <div v-else>
          <p> It looks like you don't have any Meals (tasks) to work on yet. Try Making one by clicking on the "Add Task! Button" in the upper right hand corner </p>
        </div>
      </div>
      <div class="grid-child-b">
        <!-- show different pictures based on progress -->
        <img id="mochi-sleeping" src="/images/mochi-sleeping.png" alt="please put this poor dev out of their misery " >
        <template v-if="nibblesLeft <= 0">
          <h4> Mochi got all of his nibbles today! Good job </h4>
        </template>
        <template v-else-if="nibblesLeft > 0 && nibblesLeft <=4">
          <h4> Mochi needs <strong style="color: #E27272"> {{nibblesLeft}} more nibbles</strong> today </h4>
        </template>
        <template v-else-if="nibblesLeft === 5">
          <h4> Mochi needs <strong style="color: #E27272"> {{nibblesLeft}} more nibbles</strong> today </h4>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import TodoTree from '../components/TodoTree';
export default{
  name: "Dashboard",
  created: function(){
    fetch(`/api/validate`)
    .then(res => {
      if(res.status === 200 ){
        this.$store.dispatch("getAllTodos");  //get all of the todos
      }
      else{
        this.$router.push('/');
      }
    })
    .catch(err => {
      console.log(err);
    })
  },
  computed: {
    todos(){
      return this.$store.state.todos;
    },
    nibblesLeft(){
      return  this.$store.state.nibbleCount - this.$store.state.nibblesCompleted;
    }
  },
  methods:{
    showSubTasks: function(todo){
      //NOt using dynamic routes cause of `nuxt generate`
      this.$store.dispatch('setCurrentItem', todo)
      .then(() => this.$router.push('/editTask'))
      .catch(err => console.error(err));
    },
    showTimerPage: function(todo){
      this.$store.dispatch('setCurrentItem', todo)
      .then(() => this.$router.push(`/timer?taskID=${todo.id}`))
      .catch(err => console.error(err));
    },
    handleDelete: function(id){
      this.$store.dispatch('delete', {id: id, taskID: id}).catch(err => console.error(err));
    },
    handleUpdate: function(e ,todo){
      console.log(e.target.value);
      this.$store.dispatch('update', {form: {...todo, name: e.target.value}, taskID: todo.id })
      .catch(err => console.error(err));
    }
  },
  components: {TodoTree}
}
</script>

<style scoped lang="scss">
#date-header{
  color: $main-color;
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  line-height: 45px;
}

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
  margin-left: 1em;
  h4{
    text-align: center;
  }
}
// form input for the main task
.edit-form-input{
    width: 80%;
    padding-left: 0px;
    border-bottom: none;
    font-weight: bolder;
}
.edit-form-input:hover{
  border-bottom: 1px solid black;
}
.name-kebob{
  display: flex;
  justify-content: space-between;
  align-items: center;
  h4{
    font-size: 24px;
    font-weight: bold;
  }
}

#mochi-sleeping{
  width: 80%;
  height: auto; 
}
#task-actions{
  display: flex;
  justify-content: space-around;
  button{
    width: 100%;
  }
}
#header-info{
  display: flex;
  justify-content: space-between;
  margin-top: 1em;
}
.todo-icon{
  width: 20px;
  height: auto;
}
.todo-icon:hover{
  cursor: pointer;
}
.work-on-task{
    margin-bottom: 0px;
    color: darkgray;
    max-width: 140px;
    text-decoration: underline;
}
.work-on-task:hover{
    color: $main-color;
    cursor: pointer;
}

.task-finished{
  color: $mild;
}

@media only screen and (max-width: $phone){
  .dashboard-grid{
    grid-template-columns: 100%;
    grid-template-areas: 
      "edit"
      "list"
  }
  
  .grid-child-b{
    margin-left: 0px;
    img{
      margin-left: auto;
      margin-right: auto;
      width: 50%;
    }
  }
}
</style>
