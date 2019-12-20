<template>
  <div class="todo-container">
    <div class="todo-child">
        <input type="checkbox"/>
    </div>
    <div class="todo-child">
      <h3 @click="handleClick">{{name}}</h3>
      <p>{{desc}}</p>
    </div>
  </div>
</template>

<script>
export default {
    name: "Todo",
    data: function(){
        return{
            checked: false
        }
    },
    props: ['name', 'desc'],
    methods:{
        handleClick: function(){
            alert("clicked!");
        }
    }
};
</script>

<style>
    .todo-container{
        display: flex;
    }
    .todo-child{
        margin-left: 1em;
    }
    h3:hover{
        color: red;
    }

</style>
