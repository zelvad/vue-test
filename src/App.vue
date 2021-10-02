<template>
  <div id="nav">
    <router-link :to="{ name: 'Home' }">Главная</router-link>
    <router-link v-if="!this.isAuth()" :to="{ name: 'Auth' }">Авторизация</router-link>
    <router-link v-if="!this.isAuth()" :to="{ name: 'Register' }">Регистрация</router-link>
    <button class="button" v-if="this.isAuth()" @click.prevent="logout">Выйти</button>
  </div>
  <router-view/>
</template>


<script>
import authHelper from "./helpers/authHelper";

export default {
  methods: {
    isAuth () {
      return authHelper.isAuth();
    },
    logout() {
      this.$store.commit('clearToken');
      this.$store.commit('clearExpiry');

      this.$router.push({
        name: 'Auth'
      });
    }
  },
  watch: {
    '$route' (to) {
      document.title = to.meta.title
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

#nav {
  padding: 30px;
  display: flex;
  justify-content: end;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 15px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
#nav button {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  color: #2c3e50;
  font-weight: bold;
}
</style>
