<template>
  <div>
    <!-- header -->
    <div>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <nuxt-link to="/dashboard" class= "navbar-brand" >Nibble</nuxt-link>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <nuxt-link class="menu-link" to="/dashboard">Dashboard</nuxt-link>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template v-slot:button-content>
                <em>User</em>
              </template>
              <b-dropdown-item href="/settings">My settings </b-dropdown-item>
              <li role="presentation">
                <nuxt-link to="/logout" class= "dropdown-item" role="menuitem" >Sign Out</nuxt-link>
              </li>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <!-- Body  -->
    <div id="body-content" >
      <OnlineStatus/>
      <nuxt/>
    </div>
  </div>
</template>
<script>
import OnlineStatus from "../components/OnlineStatus";
export default {
  components:{ OnlineStatus}
}
</script>>
<style lang="scss">
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

#body-content{
  margin-right: $page-margin;
  margin-left: $page-margin;
  margin-bottom: 2em;
}

.menu-link {
  color: white;
  text-decoration: none;
  margin-left: 0.5em;
}

.menu-link:hover {
  color: lightblue;
  text-decoration: none;
}
</style>
