<template>
  <div id="app">
    <div class="route-wrapper" v-if="showRoute">
      <router-link to="/">Go to index</router-link>
      <router-link to="/list">Go to list</router-link>
      <router-link to="/user">Go to user</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      showRoute: process.env.NODE_ENV === 'development'
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.ivu-spin-dot{ background-color: #2196F3 !important }
</style>
