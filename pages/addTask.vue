<template>
    <div id ="add-task-page">
        <h2> Add a new Task </h2>
        <hr/>
        <b-form @submit="onSubmit">
        <div v-if="currStep === 1" class="step-one">
            <b-form-group id="input-group-1" label="Task Name" label-for="input-1">
            <b-form-input id="input-1" v-model="form.name" required placeholder="Enter Name"></b-form-input>
            </b-form-group>
            <p>Task Priority: {{form.priority}}</p>
            <b-input-group id="input-group-5" prepend="1" append="5" class="mt-3">
            <b-form-input id="form-prior" type="range" min="1" max="5" v-model="form.priority" required></b-form-input>
            </b-input-group>

            <b-button id="next-button" type="button" variant="primary" @click="checkForm">Next</b-button>
      </div>
      <div v-if="currStep === 2" class="step-two">
        <img src="/images/mochi-concept.png" alt="i hate this class" width="50%" height="auto"/>
        <p>Added a task! do you think you can finish this in the time you set? Would you like to break it down into bite size pieces?</p>
        <b-button type="button" variant="primary" @click="onSubmit"> I'm good! </b-button>
        <b-button type="button" variant="primary" @click="handleNextStep(3)">Add Bites</b-button>
      </div>
      <div v-if="currStep === 3">
        <div class="mochi-add-bites">
            <div>
                <div class="speech-bubble">
                    <p>Let's create up to three 'bites' to make this task more managable! If you need to, you can even break down the 'bite' further into 'nibbles'! </p>
                </div>
                <img src="/images/mochi-concept.png" alt="no me gusta vivir" width="50%" height="auto"/>
                <div>
                  <b-button type="button" @click="addBite" variant="primary"> Add new Bite </b-button>
                  <b-button type="button" @click="deleteBite" variant="primary"> Remove </b-button>
                </div>
                <div id="button-draft" v-if="draft.length > 0">
                  <p> My Bites: </p>
                  <template v-for="(i, index) in draft">
                    <b-button @click="handleEdit(i, index)" type="button" variant="primary" :key="index" > {{i.subtask.subtask_name}} </b-button>
                  </template>
                </div>
                <div v-else>
                  <p> Added Bites show up here! </p>
                </div>
            </div>
            <div class="add-todo-container">
                <!-- Add bites here -->
                  <div>
                    <div class="header-options">
                      <h3> Add a bite for "{{form.name}}" </h3>
                      <!-- push object to nibble array if button clicked -->
                      <!-- Validate this current form before adding new bite -->
                    </div>
                    <!-- Adding new bites -->
                    <div class="add-bite-container">
                      <b-card bg-variant="light">
                          Name: <b-form-input v-model="activeDraft.subtask.subtask_name" type="text" placeholder="Bite name"></b-form-input>
                      </b-card>
                    </div>
                    <div class="nibbles-container">
                      <h4> Add Nibbles (optional) </h4>
                        <b-card bg-variant="light">
                          Name: <b-form-input type="text" v-model="activeDraft.nibbles[0].nibble_name" placeholder="Nibble name"></b-form-input>
                        </b-card>
                        <b-card bg-variant="light">
                          Name: <b-form-input type="text" v-model="activeDraft.nibbles[1].nibble_name" placeholder="Nibble name"></b-form-input>
                        </b-card>
                    </div>
                    <!-- submit everything -->
                    <b-button type="button" variant="primary" @click="handleSetSubtasks">I'm done! </b-button>
                  </div>
            </div>
        </div>
      </div>
      <div v-if="currStep === 4" class="step-four">
        <p>Added a task!</p>
        <b-button type="button" @click ="$router.push('/dashboard')" > Take me to my dashboard! </b-button>
      </div>
    </b-form>
    </div>
</template>
<script>
export default {
  name: 'add-task',
  data: function() {
    return {
      form: {
        name: null,
        priority: null
      },
      addSubtask: false,
      activeIndex: -1,
      currStep: 1,
      activeDraft: { //Active draft object
        subtask:{
          subtask_name: null
        },
        nibbles: [{ nibble_name: null}, {nibble_name: null}],
      },
      draft: [], //hold array of the bites being made
    }
  },
  methods: {
    checkForm: function(){
      if(this.form.name && this.form.priority){
        this.currStep = 2;
      }
      else{
        alert("Please fill out all the fields");
        return;
      }
    },
    deleteBite: function(){
      if(this.activeIndex === -1){
        alert("please add or select a draft to remove");
        return;
      }
      else{
        this.draft.splice(this.activeIndex, 1);
        // reset to null
        this.activeDraft = {
          subtask:{ subtask_name: null},
          nibbles: [{ nibble_name: null}, {nibble_name: null}]
        }
        this.activeIndex = -1;
      }
    },
    addBite: function(){
      if(this.draft.length === 3){
        alert("You can only have 3 bites!");
        return;
      }
      let nDraft = [];
      // check the bites
      if(this.activeDraft.subtask.subtask_name === null){
        alert("Please give your bite a name");
        return;
      };
      let copySub = {...this.activeDraft.subtask}; //copy subtask name
      // IMPORTANT !!!!!
      // Breaks if user fills out second nibble option and not first option
      if(this.activeDraft.nibbles[0].nibble_name) nDraft.push({...this.activeDraft.nibbles[0], subtask_name: copySub.subtask_name }); //copy object
      if(this.activeDraft.nibbles[1].nibble_name) nDraft.push({...this.activeDraft.nibbles[1], subtask_name: copySub.subtask_name });
      console.log("Adding new bite: ", {
        subtask: copySub,
        nibbles: nDraft
      });
      //Push it to the array if its new. If its editing just replace the index in the array
      if(this.activeIndex === -1){
        this.draft.push({
          subtask: copySub,
          nibbles: nDraft
        })
      }
      else{
        //just editing so replace index
        this.draft.splice(this.activeIndex, 1,{
          subtask: copySub,
          nibbles: nDraft
        });
        this.activeIndex = -1;
      }
      // Reset the object
      nDraft = [];
      this.activeDraft = {
        subtask:{subtask_name: null},
        nibbles: [{ nibble_name: null}, {nibble_name: null}],
      }
    },
    handleEdit: function(draft, index){
      //check if there are less than 2 nibbles
      let copy = {...this.draft[index]};
      if(copy.nibbles.length === 0){
        //set null object
      }
      else if(!copy.nibbles[0].nibble_name){
        //set the null object
      }
      else if(!copy.nibbles[1].nibble_name){
        //set null object
      }
      else{
        this.activeDraft = this.draft[index];
      }
      this.activeIndex = index;
    },
    handleNextStep: function(n) {
      this.currStep = n;
    },
    handleSetSubtasks: function(){
      if(this.draft.length === 0){
        alert('please add at least one bite');
        return;
      }
      //format the draft array properyly to be sent to server
      let s = [];
      let n = [];
      for(let i=0; i< this.draft.length; i++){
        s.push(this.draft[i].subtask);
        n.push(...this.draft[i].nibbles);
      }
      let data = {
        ...this.form,
        subtasks: s,
        nibbles: n
      }
      //get data and send it to store
      this.$store.dispatch('addTodo', data);
      //go to the end of form 
      this.handleNextStep(4);
    },
    onSubmit: function(){
      console.log(this.form);
      this.$store.dispatch('addSingleTask', this.form);
      this.handleNextStep(4);
    }
  }
}
</script>
<style lang="scss" scoped>
  .mochi-add-bites{
      display: flex;
  }
  .speech-bubble::after {
      right: 80%;
  }
  .add-todo-container{
      margin-left: 1em; 
  }
  #button-draft{
    button{
      margin-bottom: .5em;
    }
  }
  #add-task-page{
    margin-left: 15%;
    margin-right: 15%;
  }
  @media only screen and (max-width: $phone){
    .mochi-add-bites{
      flex-direction: column;
    }
    #add-task-page{
      margin-left: 5%;
      margin-right: 5%;
    }
  }
</style>