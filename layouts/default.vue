<template>
  <div>
    <!-- header -->
    <div>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <nuxt-link id="app-name" to="/dashboard" class= "navbar-brand" >nibble</nuxt-link>
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
                <em>Profile</em>
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
      <nuxt/>
    </div>
  </div>
</template>
<style lang="scss">
#app-name{
  font-family: $title-font;
  font-style: normal;
  font-weight: normal;
  font-size: 36px;
  line-height: 44px;
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
  color: white;
  text-decoration: none;
}
</style>
