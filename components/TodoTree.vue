<template>
  <div>
    <!-- Actual content of the todo -->
    <TodoNode :taskID="taskID" :level="bite" :todo="todo"/>
    <div :id=" childrenId ">
    <template v-if="todo.children.length > 0">
        <!-- Render any Sub Tasks -->
        <template v-for="i in todo.children">
          <!-- Replace with todoTree for n deep layers of children. Doing this for styling sake -->
          <TodoNode :taskID="taskID" :level="nibble" :key="i.id" :todo="i" />
        </template>
    </template>
    </div>
  </div>
</template>

<script>
import TodoNode from "../components/TodoNode";
  export default{
    name: "TodoTree",
    data: function(){
      return{
        bite: 'bite',
        nibble: 'nibble'
      }
    },
    props:{
      todo: Object,
      childrenId: String,
      taskID: String //Always reference to the task ID
    },
    components: {TodoNode}
  }
</script>

<style scoped>
  h3{
    text-align: left;
  }
  p{
    text-align: left;
  }
  .show-list{
    display: none;
  }
</style>