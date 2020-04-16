<template>
    <main>
      <section id="introduction">
        <div class="introtext">
          <h1>Get more done <br>with Mochi.</h1>
          <p>Mochi uses a variety of productivity techniques that will help you get motivated, feel better, and complete that to-do list. </p>
          <div>
            <b-button variant="primary">
              <nuxt-link to="register">sign up</nuxt-link>
            </b-button>
          </div>
        </div>
        <img src="https://i.imgur.com/8gcgTFh.png">
      </section>
      <section id="threecol">
        <div class="colcont">
          <font-awesome-icon icon="paw" class="fa-3x icon-circle" />
          <p>Our companion keeps you company while you do your work. Mochi's encouragements and guidance can help you be your best self.
          </p>
        </div>
        <div class="colcont">
          <font-awesome-icon icon="bone" class="fa-3x icon-circle" />
          <p>Our app features a fun, colorful interface. You'll forget that you were supposed to be productive when you're feeding Mochi.
          </p>
        </div>
        <div class="colcont">
          <font-awesome-icon icon="feather-alt" class="fa-3x icon-circle" />
          <p>Lightweight, fast, and non-intrusive. Our app makes it easy to put in your tasks and finish them with a single click.
          </p>
        </div>
      </section>
      <section class="marketsect">
        <div class="markettxt">
          <h2>Tasks at a glance</h2>
          <p>
            Your dashboard lets you see your personalized to-do list all on one page.
          </p>
        </div>
        <img src="https://i.imgur.com/5o2khpE.png"/>
      </section>
      <section class="marketsect">
        <img src="https://i.imgur.com/tJ9NuQd.png"/>
        <div class="markettxt">
          <h2>Chunk your productivity</h2>
          <p>
            Working in intervals is proven to help you focus better, feel better, and get more done.
          </p>
        </div>
      </section>
      <section class="marketsect">
        <div class="markettxt">
          <h2>Personalize your tasks</h2>
          <p>
            You're in control of your priorities, and our streamlined process makes it quick and easy to create and go.
          </p>
        </div>
        <img src="https://i.imgur.com/w5rx8eu.png"/>
      </section>
      <Section id="footer">
        <h1>Ready to start?</h1>
          <p>Get ready to meet Mochi</p>
            <b-button variant="primary"> 
              <nuxt-link to="register">Sign up!</nuxt-link>
            </b-button>
      </section>
    </main>
</template>
<script>
export default {
  name: 'landing-page',
  layout: 'home'
}
</script>
<style scoped lang="scss">
main {
  padding: 50px;
}
a{
    color: white;
    text-decoration: none;
}
a:hover{
  color: white;
  text-decoration: none;
}
section {
  margin:0rem 0 8rem 0;
}
.introtext {
  h1{
    color: $main-color;
  }
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

p {
  margin:10px 0 10px 0;
  line-height: 1.6;
  font-weight:500;
  font-size:1.2rem;
}

#introduction img {
  max-width: 60%;
  height: auto;
}

#introduction {
  display: flex;
  justify-content: space-around;
}

#threecol {
  display: flex;
  justify-content: space-around;
}

.colcont {
  max-width: 250px;
  text-align: Center;
}

.colcont p {
  text-align: left;
  font-size: 1rem;
  font-weight: 600;
}

// the font awesome icon
.icon-circle{
  height: 100px;
  width: 100px;
  border-radius: 50%;
  padding: .3em;
  background-color: $main-color;
  color: white;
}

.marketsect {
  display:flex;
  justify-content:space-around;
  margin-bottom:8rem;
  h2 {
    font-size: 1.5rem;
    color: $main-color;
  }
}

.marketsect img {
  margin-left: 2em;
  margin-right: 2em;
  margin-top: 1em;
  margin-bottom: 1em;
  width: 750px;
  height: auto;
  border: 1px solid lightgrey;
}

.marketsect h2 {
  font-size:2rem;
}

.marketsect p {
  font-size:1.2rem;
}

.markettxt {
  display:flex;
  justify-content:center;
  flex-direction:column;
}

#footer {
  text-align:center;
  h1{
    font-weight: bolder;
    color: $main-color;
  }
}
</style>