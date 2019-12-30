<template>
  <div class="container">
    <p>Set timer - 15min, 25 min increments</p>
    <div>
      <h3>Task name: {{$store.state.currentToDo.name}} </h3>
    </div>
    <button>Start</button>
    <button>Stop</button>
  </div>
</template>

<script>
export default {
  name: "TimerPage",
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
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  text-align: center;
}
</style>
