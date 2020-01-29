<template>
    <!-- The information and modal -->
    <div class="todo-child">
        <input class="todo-checkbox" v-model="checked" type="checkbox"/>
        <h4 :class="isChecked" @click="handleClick($bvModal)">{{todo.name}}</h4>
        <p :class="isChecked" >{{todo.desc}}</p>
        <b-modal :id="'modal-'+todo.id" :title="todo.name" hide-footer>
            <EditItemForm :todo="todo"/>
        </b-modal>
    </div>
</template>

<script>
import EditItemForm from "../components/EditItemForm";
export default {
    name: "TodoNode",
    props: {
        todo: Object
    },
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
        margin-left: 1.5em;
    }
    .todo-checkbox{
        display: inline-block;
    }
    h4{
        display: inline-block;
    }
    h4:hover{
        color: red;
    }
    p{
        text-align: left;
    }
    .task-checked{
        text-decoration: line-through;
    }
    .task-unchecked{
        text-decoration: none;
    }

</style>
