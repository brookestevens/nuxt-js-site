<template>
  <div v-if="currTodo" id="timer-container">
    <div id="mochi-speech-bubble">
      <div class="speech-bubble">
        <p> You can do this! How long would you like to work on <strong> {{currTodo.name}} </strong> ? </p>
      </div>
      <img id="mochi-sitting" src="/images/mochi-concept.png" alt="i want to die">
    </div>
    <div id="start-timer">
      <div id="timer-container" > {{minutes}} : {{seconds}} </div>
      <div id="timer-buttons">
        <b-button @click="handleClick" variant="outline-primary"> Start Timer! </b-button>
        <b-button @click="stopTimer" variant="outline-primary"> Stop </b-button>
      </div>
    </div>
    <b-modal id="task-complete-modal" title="Time's Up!" hide-footer>
      <p class="my-4"> Do you think you'll need more time to work on this task? </p>
      <!-- Do nothing if they need more time -->
      <b-button variant="primary" @click="$bvModal.hide('task-complete-modal')"> Yes, I need more time </b-button>
      <!-- cross off the task if they finished -->
      <b-button variant="outline-primary" @click="finishTask" > Nope, I finished! </b-button>
    </b-modal>
  </div>
  <div v-else>
    <p> Please select a task to work on first! </p>
    <b-button @click="$router.push('/dashboard')" variant="outline-primary">Take me to my dashboard</b-button>
  </div>
</template>

<script>
export default {
  name: "TimerPage",
  data: function(){
    return{
      currTodo: this.$store.state.currentToDo,
      interval: this.$store.state.timeInt, //the user defined time to work on stuff
      minutes: this.$store.state.timeInt,
      seconds: 0,
      countDownDate: 0
    }
  },
  mounted: function(){
    // Inside page components
    this.$OneSignal.push(() => {
      this.$OneSignal.isPushNotificationsEnabled(isEnabled => {
        if (isEnabled) {
          console.log("Push notifications are enabled!");
        } else {
          console.log("Push notifications are not enabled yet.");
        }
      });
    });

    // Using window and array form
    window.$OneSignal.push([
      "addListenerForNotificationOpened",
      data => {
        console.log("Received NotificationOpened:", data);
      }
    ]);
  },
  methods: {
    handleClick: function(){
      // arrow function to prevent losing reference to 'this'
      this.countDownDate = new Date().getTime() + (this.interval * 60000);
      if(this.$store.state.taskInProgress === 'false'){
        this.$store.dispatch('toggleTask');
        let interval = setInterval(() => {
          let now = new Date().getTime(); //curr amount of milliseconds 
          let distance = this.countDownDate - now;
          this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
          if( distance <= 0){ 
            var options = {
              body: this.currTodo.name,
              icon: '/icon.png'
            }
            new Notification('Nibble Reminder - Time\'s Up!', options);
            clearInterval(interval); //stop the loop
            this.$store.dispatch('toggleTask'); //set it back to false
            // open modal to ask if task was finished or not
            this.$bvModal.show('task-complete-modal');
          }
        }, 1000);
      }
      else{
        alert('task already started! please wait until it\'s finished or take a break.')
      }
    },
    stopTimer: function(){
      //stop timer by setting the end date to 0
      this.countDownDate = 0;
    },
    finishTask: function(){
      // Use the update route! => task-ID is in the query param
      fetch('/api/changeTaskStatus', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({id: this.currTodo.id}) })
      .then(res => {
        if(res.status === 200){
          let id = window.location.search.replace('?taskID=', '');
          // this.$store.dispatch('update', {form: {...this.currTodo, status: !this.currTodo.status}, taskID: id})
          // .catch(err => console.error(err));
          return res.json();
        }
      })
      .then(res => {
        this.$store.commit('UPDATE_TASKS_COMPLETED', res[2].tasks_completed); //response from DB
      })
      .catch(err => console.error(err))
    }
  }
};
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  text-align: center;
}
#options-div{
  display: flex;
  justify-content: center;
}
.option-card{
  border: 1px solid black;
  padding: 1em;
  margin: 1em;
}
.speech-bubble::after {
  right: 70%;
}

#mochi-speech-bubble{
  display: flex;
  flex-direction: column;
  align-content: center;
}

#mochi-sitting{
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 30%;
}

#timer-container{
  margin-top: 0px;
  font-size: 3em;
  text-align: center;
}

#start-timer{
  margin: auto;
  width: 50%;
}
#timer-buttons{
  display: flex;
  justify-content: space-between;
}

</style>
