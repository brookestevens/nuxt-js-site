<template>
  <div v-if="currTodo" id="timer-container">
    <div id="mochi-speech-bubble">
      <div class="speech-bubble">
        <p> You can do this! How long would you like to work on <strong> {{currTodo.name}} </strong> ? </p>
      </div>
      <img id="mochi-sitting" src="/images/mochi-concept.png" alt="i want to die">
      <div> {{ new Date().getUTCMinutes() }} </div>
    </div>
    <div id="start-timer">
      <b-button @click="handleClick" variant="outline-primary"> Start Timer! </b-button>
    </div>
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
      currTodo: this.$store.state.currentToDo
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
      let startMin = new Date().getUTCMinutes(); //minutes after the current hour
      let finish = (startMin + 1 )%60; //replace 1 with 25
      if(this.$store.state.taskInProgress === 'false'){
        this.$store.dispatch('toggleTask');
        let interval = setInterval(() => {
          // loop until the designated minutes happen
          console.log('interval looped');
          let currMin = new Date().getUTCMinutes();
          if( currMin === finish){
            var options = {
              body: this.currTodo.name,
              icon: '/icon.png'
            }
            new Notification('Nibble Reminder - Time\'s Up!', options);
            console.log('stopped!: ', currMin);
            clearInterval(interval); //stop the loop
            this.$store.dispatch('toggleTask'); //set it back to false
          }
        }, 1000);
      }
      else{
        alert('task already started! please wait until it\'s finished or take a break.')
      }
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
  margin-top: 2em;
}

</style>
