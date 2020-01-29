<template>
  <div class="network-status">
    <div class="offline-true" v-if="!online">
        &#10060; App is offline and will run in 'offline mode'. Data will be saved, but 
        changes may not be reflected until a network connection is made again
    </div>
    <div class="online-true" v-else>
      <p> &#9989; {{ message }} </p>
    </div>
  </div>
</template>

<script>
export default{
  name: "OnlineStatus",
  data: function(){
    return{
        online: true,
        appWentOffline: false,
        message: "App is online"
    }
  },
  mounted: function(){
    window.addEventListener('online', () => {
        this.online = true;
        if(this.appWentOffline){
            this.message = "Back online! Refresh page to see any updates";
            this.appWentOffline = false;
        }
    });
      window.addEventListener('offline', () => {
          this.online = false;
          this.appWentOffline = true;
      });
  },
}
</script>
<style scoped>

</style>

