<template>
  <div class="tree-container">
    <ul>
      <template v-for = "i in todo">
        <li :key="'li-'+i.id">
            <TodoNode :key="i.id" :todo="i"/>
        </li>
        <template v-if="i.children.length > 0">
          <TodoTree :key="i.id" :todo="i.children" />
        </template>
      </template>
    </ul>
  </div>
</template>

<script>
import TodoNode from "../components/TodoNode";
  export default{
    name: "TodoTree",
    props:['todo'],
    // watch: { 
    //   	todo: function(newVal, oldVal) { // watch it
    //       console.log('Prop changed: ', newVal, ' | was: ', oldVal)
    //     }
    // },
    components: {TodoNode}
  }
</script>