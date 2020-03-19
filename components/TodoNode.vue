<template>
    <!-- The information and modal -->
    <div :class="`todo-child ${level}`">
        <b-card class="node-card-text">
            <b-card-text class="todo-content">
              <div>
                <b-form-input :id="`name-${todo.id}`" @blur="handleUpdate" class="edit-form-input" v-model="taskName" placeholder="Task name"></b-form-input>
                <template v-if="todo.status === false && todo.children.length === 0">
                    <!-- If the status is false and its the deepest nested child then be allowed to work on it -->
                    <h6 @click="showTimerPage(todo)" :class="`work-on-task task-status-${todo.status}`" > Work on this task! </h6>
                </template>
                <template v-else-if="todo.status === true ">
                    <!-- if the task is finished, show that its done -->
                    <h6 class="task-finished"> Completed! </h6>
                </template>
              </div>
              <img @click="handleDelete" id="edit-icon" src="/images/trash-can.png" alt="kill me plz" />
            </b-card-text>
        </b-card>
    </div>
</template>

<script>
export default {
    name: "TodoNode",
    props: {
        todo: Object,
        level: String,
        taskID: String
    },
    data: function(){
        return{
            checked: false,
            taskName: this.todo.name
        }
    },
    methods:{
        showTimerPage: function(todo){
            this.$store.dispatch('setCurrentItem', this.todo)
            .then(() => this.$router.push(`/timer?taskID=${this.taskID}`))
            .catch(err => console.error(err));
        },
        handleDelete: function(){
            //alert("deleting at index: " + this.todo.id);
            this.$store.dispatch('delete', {id: this.todo.id, taskID: this.taskID})
            .then(() => this.$router.push('/dashboard'))
            .catch(err => console.error(err));
        },
        handleUpdate: function(){
            //alert(`Updating the item: ${this.taskName}`); //works!
          this.$store.dispatch('update', {form: {...this.todo, name: this.taskName}, taskID: this.taskID})
          .catch(err => console.error(err));
        },
    },
    computed: {
        isChecked(){
            if(this.checked === true){
                return "task-checked";
            }
            else{
                return "task-unchecked";
            }
        }
    }
};
</script>

<style scoped lang="scss">
    .todo-container{
        display: flex;
    }
    .todo-checkbox{
        display: inline-block;
    }
    h4{
        display: inline-block;
        margin-bottom: 0px;
    }
    .task-checked{
        text-decoration: line-through;
    }
    .task-unchecked{
        text-decoration: none;
    }
    .nibble{
        margin-left: 2em;
    }
    .card.node-card-text{
        border-left: 1px solid rgba(0, 0, 0, 0.125);
    }
    .todo-content{
        display: flex;
        align-items: center;
        justify-content: space-between;
        div{
            width: 80%;
        }
    }
    #edit-icon{
        height: 20px;
        width: auto;
    }
    #edit-icon:hover{
        cursor: pointer;
    }
    .work-on-task, task-finished{
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
        text-decoration: none;
    }
    .edit-form-input{
        border: none;
        padding-left: 0px;
        padding-bottom: 1px;
        margin-bottom: .4em;
        font-size: 1em;
        font-weight: 500;
    }
    .edit-form-input:hover{
        border-bottom: 1px solid black;
        cursor: pointer;
    }

</style>
