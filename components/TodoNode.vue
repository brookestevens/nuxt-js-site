<template>
  <div class="todo-container">
    <div class="todo-child">
        <input v-model="checked" type="checkbox"/>
    </div>
    <div class="todo-child">
      <h3 :class="isChecked" @click="handleClick($bvModal)">{{todo.name}}</h3>
      <p :class="isChecked" >{{todo.desc}}</p>
    </div>
    <b-modal :id="'modal-'+todo.id" :title="todo.name" hide-footer>
        <EditItemForm :todo="todo"/>
    </b-modal>
  </div>
</template>

<script>
import EditItemForm from "../components/EditItemForm";
export default {
    name: "TodoNode",
    props: ['todo'],
    data: function(){
        return{
            checked: false
        }
    },
    methods:{
        handleClick: function(m){
            this.$store.dispatch('setCurrentItem', this.todo);
            var modalID = 'modal-' + this.todo.id;
            m.show(modalID);
        }
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
    },
    components:{
        EditItemForm
    }
};
</script>

<style scoped>
    .todo-container{
        display: flex;
    }
    .todo-child{
        margin-left: 1em;
    }
    h3:hover{
        color: red;
    }
    .task-checked{
        text-decoration: line-through;
    }
    .task-unchecked{
        text-decoration: none;
    }

</style>
