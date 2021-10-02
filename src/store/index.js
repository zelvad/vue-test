import { createStore } from 'vuex'

export default createStore({
  state: {
    token: localStorage.getItem('auth') || '',
    expires_in: localStorage.getItem('expires_in') || ''
  },
  mutations: {
    setToken (state, token) {
      localStorage.setItem('auth', token);
      state.token = token;
    },
    clearToken (state) {
      localStorage.removeItem('auth');
      state.token = '';
    },
    setExpiry(state, expires_in) {
      let now = new Date();
      let expiryDate = new Date(now.getTime() + expires_in * 1000);
      localStorage.setItem('expires_in', expiryDate.getTime().toString());
      state.expires_in = expiryDate.getTime().toString();
    },
    clearExpiry(state) {
      localStorage.removeItem('expires_in');
      state.expires_in = '';
    }
  },
  actions: {
  },
  modules: {
  }
})
