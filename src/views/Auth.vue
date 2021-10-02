<template>
  <div id="auth" style="height: 80vh">
    <div class="row justify-content-center align-items-center h-100">
      <div class="col-lg-3 border" style="border-radius: 5px; padding: 30px">
        <div class="errors" v-if="serverResponse">
          <div class="alert-danger alert">{{ serverResponseErrors }}</div>
        </div>
        <div class="col-lg-12 d-flex justify-content-center">
          <h3 style="padding: 10px 0"><b>Авторизация</b></h3>
        </div>
        <form>
          <div class="d-flex justify-content-start text-left">
            <div class="form-group w-100">
              <input type="email" v-model="credentials.email" class="form-control" placeholder="Email">
              <span style="color: red" v-if="validationErrors.email.check">{{ validationErrors.email.message }}</span>
            </div>
          </div>
          <div class="d-flex justify-content-start text-left">
            <div class="form-group w-100">
              <input type="password" v-model="credentials.password" class="form-control"  placeholder="Пароль">
              <span style="color: red" v-if="validationErrors.password.check">{{ validationErrors.password.message }}</span>
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <!--<div class="form-group m-0">
              <input type="checkbox" id="rememberMe">
              <label for="rememberMe" class="mb-0" style="margin-left: 10px; cursor: pointer; user-select: none">Запомнить меня</label>
            </div>-->
            <button @click.prevent="login" class="btn" style="background: #42b983; color: #fff;">Войти</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import methodsApi from "../helpers/axiosHelper";
import methodsValidation from "../helpers/validateHelper";
import authHelper from "../helpers/authHelper";

export default {
  name: "Auth",
  data() {
    return {
      credentials: {
        email: '',
        password: '',
      },
      validationErrors: {
        password: {
          check: false,
          message: ''
        },
        email: {
          check: false,
          message: ''
        }
      },
      serverResponse: false,
      serverResponseErrors: ''
    }
  },
  mounted() {
    authHelper.checkAuth();
  },
  methods: {
    login() {
      this.validationErrors.email.check = false;
      this.validationErrors.email.message = '';
      this.validationErrors.password.check = false;
      this.validationErrors.password.message = '';

      if (!methodsValidation.isRequired(this.credentials.email)) {
        this.validationErrors.email.check = true;
        this.validationErrors.email.message = 'Поле Email обязательно к заполнению!';
      } else if (!methodsValidation.emailValidate(this.credentials.email)) {
        this.validationErrors.email.check = true;
        this.validationErrors.email.message = 'Поле Email должно быть в формате example@domain.com!';
      }

      if (!methodsValidation.isRequired(this.credentials.password)) {
        this.validationErrors.password.check = true;
        this.validationErrors.password.message = 'Поле Пароль обязательно к заполнению!';
      }

      if (this.validationErrors.email.check || this.validationErrors.password.check) return;

       methodsApi
           .postApi('user/login', this.credentials)
           .then(data => {
             this.$store.commit('setToken', data.data.access_token);
             this.$store.commit('setExpiry', data.data.expires_in);
             this.$router.push({
               name: 'Home'
             });
           })
           .catch(data => {
             this.serverResponse = true;
             if (data.response.status === 401) {
               this.serverResponseErrors = 'Не верный логин или пароль!';
             } else if (data.response.status === 500) {
               this.serverResponseErrors = 'Произошла внутренняя ошибка сервера!';
             } else if (data.response.status === 422) {
               this.serverResponseErrors = 'Проверьте правильность введенных данных!';
             } else {
               this.serverResponseErrors = 'Произошла непредвиденная ошибка!';
             }
           });
    }
  }
}
</script>

<style scoped>

</style>