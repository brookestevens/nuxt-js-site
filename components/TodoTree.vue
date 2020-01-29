<template>
  <div>
    <!-- Actual content of the todo -->
    <TodoNode :todo="todo"/>
    <div :id=" childrenId ">
    <template v-if="todo.children.length > 0">
        <!-- Render any Sub Tasks -->
        <template v-for="i in todo.children">
          <TodoTree :key="i.id" :todo="i" />
        </template>
    </template>
    </div>
  </div>
</template>

<script>
import TodoNode from "../components/TodoNode";
  export default{
    name: "TodoTree",
    props:{
      todo: Object,
      childrenId: String
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