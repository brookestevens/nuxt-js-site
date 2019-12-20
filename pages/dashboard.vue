<template>
  <div class="container">
    <h2> Tasks and stuff </h2>
    <Todo name="Capstone Project" desc="do this to graduate"/>
    <Todo name="Capstone Project" desc="do this to graduate"/>
    <Todo name="Capstone Project" desc="do this to graduate"/>
    <Todo name="Capstone Project" desc="do this to graduate"/>
  </div>
</template>

<script>
import Todo from "../components/Todo";
export default{
  name: "Dashboard",
  created: function(){
    //check if user is actually logged in
    return;
  },
  components: {Todo}
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
}
</style>
