<template>
  <div class="edit-todo">
    <h2> Edit </h2>
    <b-form>
      <b-form-group id="input-group-1" label="Task Name" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.name"
          required
          placeholder="Enter Name"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Task Description" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.desc"
          placeholder="Enter Description (optional)"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Start" label-for="input-3">
        <b-form-input
          id="input-3"
          type = "datetime-local"
          v-model="form.start"
          required
        ></b-form-input>
      </b-form-group>
      
      <b-form-group id="input-group-4" label="Stop" label-for="input-4">
        <b-form-input
          id="input-4"
          type = "datetime-local"
          v-model="form.stop"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="button" @click="handleUpdate" variant="primary">Submit</b-button>
      <b-button type="button" @click="handleDelete" variant="danger">Delete</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
    name: "EditItemForm",
    data: function(){
        return{
          form: {
            id: this.todo.id,
            index: this.todo.index,
            name: this.todo.name,
            desc: this.todo.desc,
            start: this.todo.start,
            stop: this.todo.stop,
            status: this.todo.status,
            children: this.todo.children,
            priority: this.todo.priority || null
          },
        }
    },
    props:['todo'],
    methods:{
        handleUpdate: function(){
          this.$store.dispatch('update', this.form);
        },
        handleDelete: function(){
            this.$store.dispatch('delete', {id: this.todo.id});
        }
    }
};
</script>

<style>

</style>
