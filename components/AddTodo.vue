<template>
  <div class="edit-todo">
    <h2>Add Todo</h2>
    <b-form @submit="onSubmit">
      <div v-if="currStep === 1" class="step-one">
        <b-form-group id="input-group-1" label="Task Name" label-for="input-1">
          <b-form-input id="input-1" v-model="form.name" required placeholder="Enter Name"></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Task Description" label-for="input-2">
          <b-form-input id="input-2" v-model="form.desc" placeholder="Enter Description (optional)"></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-3" label="Start" label-for="input-3">
          <b-form-input id="input-3" type="datetime-local" v-model="form.start" required></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-4" label="End" label-for="input-4">
          <b-form-input id="input-4" type="datetime-local" v-model="form.end" required></b-form-input>
        </b-form-group>
        <p>Task Priority: {{form.priority}}</p>
        <b-input-group id="input-group-5" prepend="1" append="10" class="mt-3">
          <b-form-input id="form-prior" type="range" min="1" max="10" v-model="form.priority" required></b-form-input>
        </b-input-group>
        <b-button type="button" variant="primary" @click="handleNextStep(2)">Next</b-button>
      </div>
      <div v-if="currStep === 2" class="step-two">
        <p>Added a task! do you think you can finish this in the time you set? Would you like to break it down into bit size pieces?</p>
        <p>if yes => go to step-four, if no => go to step three</p>
        <button @click="onSubmit">I'm good</button>
        <button type="button" @click="handleNextStep(3)">Add bites</button>
      </div>
      <div v-if="currStep === 3" class="step-three">
        <p>Adding sub tasks.. PUT THIS IN LATER!</p>
        <button type="submit">Add task</button>
      </div>
      <div v-if="currStep === 4" class="step-four">
        <p>Added a task!</p>
        <b-button type="button" @click="addNew">Add another task</b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "AddTodo",
  data: function() {
    return {
      form: {
        name: null,
        desc: null,
        start: null,
        end: null,
        priority: null
      },
      addSubtask: false,
      currStep: 1,
      subtasks: [] //array of objects
    };
  },
  methods: {
    handleAddSubtasks: function() {
      return;
    },
    addNew: function() {
      this.currStep = 1;
      this.form = {
        name: null,
        desc: null,
        start: null,
        end: null,
        priority: null
      };
    },
    handleNextStep: function(n) {
      this.currStep = n;
    },
    onSubmit: function(e) {
      e.preventDefault();
      if (this.subtasks.length === 0) {
        this.$store.dispatch("addTodo", { ...this.form, children: [] });
      } else {
        this.$store.dispatch("addTodo", {
          ...this.form,
          children: this.subtasks
        });
      }
      this.currStep = 4;
    }
  }
};
</script>

<style>
</style>
