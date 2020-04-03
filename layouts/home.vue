<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="dark">
            <nuxt-link id="app-name" to="/" class= "navbar-brand">nibble</nuxt-link>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav class="ml-auto">
                    <nuxt-link class="menu-link" to="/login">Login </nuxt-link>
                    <nuxt-link class="menu-link" to="/register">Sign Up</nuxt-link>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <!-- nuxt body -->
        <nuxt/>
    </div>
</template>
<script>
export default {
    name: 'home'
}
</script>
<style scoped>
.menu-link {
  color: white;
  text-decoration: none;
  margin-left: 1em;
}

.menu-link:hover {
  color: white;
  text-decoration: none;
}
</style>