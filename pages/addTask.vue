<template>
    <div>
        <h2> Add a new Task </h2>
        <hr/>
        <b-form @submit="onSubmit">
        <div v-if="currStep === 1" class="step-one" id="add-task-page">
            <b-form-group id="input-group-1" label="Task Name" label-for="input-1">
            <b-form-input id="input-1" v-model="form.name" required placeholder="Enter Name"></b-form-input>
            </b-form-group>
            <b-form-group id="task-priority" label="How important is this task? " class="mt-3">
              <b-form-radio v-model="form.priority" name="priority-options" value="1"> Not that important</b-form-radio>
              <b-form-radio v-model="form.priority" name="priority-options" value="2"> Average </b-form-radio>
              <b-form-radio v-model="form.priority" name="priority-options" value="3"> Very important</b-form-radio>
            </b-form-group>
            <p>Do you want to break this task into smaller parts? </p>
            <div id="next-steps-container">
              <b-button variant="outline-primary" @click="checkForm">Yes, break it down </b-button>
              <b-button id="next-button" type="submit" variant="outline-primary">Nah, I'm good </b-button>
              <div id="tip-container">
                Tip: If you don't where to start, it might be a good idea to break this task into smaller bites.
              </div>
            </div>
      </div>
      <div v-if="currStep === 2" class="step-two">
        <div class="mochi-add-bites">
            <div>
                <div class="speech-bubble">
                    <p>Let's create up to three 'bites' to make this task more managable! If you need to, you can even break down the 'bite' further into 'nibbles'! </p>
                </div>
                <img src="/images/mochi-business.png" alt="no me gusta vivir" width="50%" height="auto"/>
                <div id="button-draft" v-if="draft.length > 0">
                  <p> My Bites: </p>
                  <template v-for="(i, index) in draft">
                    <b-button @click="handleEdit(i, index)" type="button" variant="primary" :key="index" > {{i.subtask.subtask_name}} </b-button>
                    <br :key="`break-${index}`"/>
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
                      <h3 style="color: #E27272" > {{form.name}} </h3>
                      <!-- push object to nibble array if button clicked -->
                      <!-- Validate this current form before adding new bite -->
                    </div>
                    <!-- Adding new bites -->
                    <div class="add-bite-container">
                      <b-card bg-variant="light">
                          <b-form-input v-model="activeDraft.subtask.subtask_name" type="text" placeholder="Bite name"></b-form-input>
                          <span @click="deleteBite" style="font-size: 20px"> &#x2715; </span>
                      </b-card>
                    </div>
                    <div class="nibbles-container">
                      <h4> Add Nibbles (optional) </h4>
                        <b-card bg-variant="light">
                          <b-form-input type="text" v-model="activeDraft.nibbles[0].nibble_name" placeholder="Nibble name"></b-form-input>
                        </b-card>
                        <b-card bg-variant="light">
                          <b-form-input type="text" v-model="activeDraft.nibbles[1].nibble_name" placeholder="Nibble name"></b-form-input>
                        </b-card>
                    </div>
                    <!-- submit everything -->
                    <b-button type="button" @click="addBite" variant="outline-primary"> Add new Bite </b-button>
                    <b-button type="button" variant="primary" @click="handleSetSubtasks">I'm done! </b-button>
                  </div>
            </div>
        </div>
      </div>
      <div v-if="currStep === 3" class="step-three">
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
      if(this.draft[index].nibbles.length === 0){
        this.draft[index].nibbles.push({ nibble_name: null}, {nibble_name: null}); // add 2 nibbles
      }
      else if(this.draft[index].nibbles.length === 1){
        this.draft[index].nibbles.push({ nibble_name: null}); // 1 new nibble
      }
      else{
        this.activeDraft = this.draft[index];// user had 2 nibbles already
      }
      this.activeDraft = this.draft[index];
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
      this.handleNextStep(3);
    },
    onSubmit: function(event){
      event.preventDefault();
      if(this.form.name && this.form.priority){
        this.$store.dispatch('addSingleTask', this.form);
        this.handleNextStep(3);
      }
      else{
        alert("Please fill out all the fields");
        return;
      }
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
      width: 50%;
  }
  .nibbles-container{
    margin-top: 1em;
    margin-bottom: 2em;
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
  #next-steps-container{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  #tip-container{
    background-color: $alert-bg;
    width: 250px;
    border-radius: 4px;
    padding: 5px;
    font-size: 12px;
  }
  .card-body{
    display: flex;
    align-items: center;
    span:hover{
      cursor: pointer;
    }
  }
  @media only screen and (max-width: $phone){
    .mochi-add-bites{
      flex-direction: column;
    }
    #add-task-page{
      margin-left: 5%;
      margin-right: 5%;
    }
    .add-todo-container{
      margin-left: 0px; 
      width: 100%;
    }
    #next-steps-container{
      flex-direction: column;
      height: 200px;
    }
    #tip-container{
      font-size: 14px;
    }
  }
</style>