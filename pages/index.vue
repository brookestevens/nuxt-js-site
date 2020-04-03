<template>
  <!-- the header renders from template -->
  <div>
  <h1> Nibble </h1>
  <p>
      This is a home page. more info soon. 
  </p>
  <h2> How it Works </h2>
  <p>
    Productivity app, but with a pet.
    <br/>
    Steps:
    <ol>
      <li> Sign in </li>
      <li> Add Tasks </li>
      <li> When you work on a task, it will set a timer</li>
      <li> You can only work on the most deeply nested task. When your done, you can delete it before working on a higher ranked task</li>
      <li> Try to reach the nibble goals before the end of the day </li>
      <li> We have an automated script that resets the amount of tasks you completed each day </li>
    </ol>
  </p>
  <h2> ⚠️ Known Bugs ⚠️</h2>
  <p> Please be careful with this app. It's verrryyyyy buggy. 🐛🐛🐛 </p>
    <ul>
      <li> No long descriptions please! it will break the DB char limit </li>
      <li> Make subtask (bites) names unique or the search feature will die </li>
      <li> Offline features are experimental, it might not work all the time </li>
      <li> Push notifications might not work (Will not appear on mobile) </li>
      <li> Splash screen will only appear on Android and iPhone 6/7/8 </li>
      <li> Timer is unreliable on mobile </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'landing-page',
  layout: 'home'
}
</script>