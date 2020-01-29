<template>
  <div class="container">
    <img src="/images/mochi-concept.png" alt="mochi sitting">
    <div>
      <h3>Task name: {{currTodo}} </h3>
      <p> How long do you want to work on this? </p>
    </div>
    <div id="options-div">
      <div class="option-card">
        <p> 15 Minutes </p>
        <b-button type="button" variant="primary" @click="handleClick(15)" > Start </b-button>
      </div>
      <div class="option-card">
        <p> 30 Minutes </p>
        <b-button type="button" variant="primary" @click="handleClick(30)" > Start </b-button>
      </div>
      <div class="option-card">
        <p> 45 Minutes </p>
        <b-button type="button" variant="primary" @click="handleClick(45)" > Start </b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TimerPage",
  data: function(){
    return{
      currTodo: this.$store.state.currentToDo.name
    }
  },
  mounted: function() {
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
    handleClick: function(time){
    // arrow function to prevent losing reference to 'this'
    console.log("here: ", time);
    setTimeout(() => {
      var options = {
        body: `Time's up for ${this.currTodo}`,
        icon: '/icon.png'
      }
      new Notification('Nibble Reminder', options);
    }, 6000);
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

</style>
