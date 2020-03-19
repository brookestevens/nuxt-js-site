<template>
    <div>
        <template v-if="currTodo !== null">
            <div id="main-task">
                <b-form-input id="task-name-input" v-model="taskName" placeholder="Enter Name" @blur="handleEdit"></b-form-input>
                <img id="trash-task" src="/images/trash-can.png" alt="rip me" @click="handleDelete" />
            </div>
            <hr/>
            <div class="page-container" >
                <div id="task-list"  v-if="currTodo.children.length > 0">
                    <template v-for="i in currTodo.children">
                        <!-- Render the Bites and nibbles -->
                        <TodoTree :taskID="currTodo.id" :todo="i" :childrenId="i.id" :key="`subtask-${i.id}`" />
                    </template>
                </div>
                <div v-else> 
                    <p>There are no bites for this task! </p>
                    <b-button variant="primary"> Work on this task! </b-button>
                </div>
                <div id="mochi-help">
                    <div class="speech-bubble">
                        <p> This is your meal! You can edit and delete your "bites" and "nibbles" here. </p>
                    </div>
                    <img id="mochi-sitting" src="/images/mochi-concept.png" alt="burn this app with fire"/>
                </div>
            </div>
        </template>
        <div v-else>
            <p> Please select a task to work on! </p>
            <b-button variant="outline-primary" @click="$router.push('/dashboard')"> Take me to my dashboard </b-button>
        </div>
    </div>
</template>
<script>
import TodoTree from '../components/TodoTree';
export default {
    name: 'edit-task',
    data: function(){
        return{
            taskName: this.$store.state.currentToDo.name
        };
    },
    computed: {
        currTodo(){ 
            return this.$store.state.currentToDo
        }
    },
    methods:{
        handleEdit: function(){
            //console.log({form: {...this.currTodo, name: this.taskName}, taskID: this.currTodo.id });
            this.$store.dispatch('update', {form: {...this.currTodo, name: this.taskName}, taskID: this.currTodo.id })
            .catch(err => console.error(err));
        },
        handleDelete: function(){
            //console.log({id: this.currTodo.id, taskID: this.currTodo.id});
            this.$store.dispatch('delete', {id: this.currTodo.id, taskID: this.currTodo.id})
            .then(() => this.$router.push('/dashboard'))
            .catch(err => console.error(err));
        }
    },
    components : {TodoTree}
}
</script>
<style lang="scss" scoped>
.page-container{
    display: flex;
    justify-content: space-between;
}
#task-list{
    margin-right: 1em;
    width: 40vw;
}
#trash-task{
    width: 30px;
    height: 30px;
}
#trash-task:hover{
    cursor: pointer;
}
#task-name-input{
    border: none;
    padding-left: 0px;
    margin-bottom: 0px;
    font-size: 1.5em;
    font-weight: 700;
    width: 80%;
}
#task-name-input:hover{
    border-bottom: 1px solid black;
    cursor: pointer;
}
#mochi-help{
    margin-top: 1em;
}
#mochi-sitting{
     width: 90%;
     height: auto;
 }
 #main-task{
     display: flex;
     justify-content: space-between;
     margin-top: 1em;
     align-items: center;
 }
 @media only screen and (max-width: $phone){
  .page-container{
      flex-direction: column-reverse;
  }
  #task-list{
      width: 75vw;
  }

}
</style>