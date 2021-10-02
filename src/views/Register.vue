<template>
  <div id="register" style="height: 80vh">
    <div class="row justify-content-center align-items-center h-100">
      <div class="col-lg-3 border" style="border-radius: 5px; padding: 30px">
        <div class="errors" v-if="serverResponse">
          <div class="alert-danger alert">{{ serverResponseErrors }}</div>
        </div>
        <div class="col-lg-12 d-flex justify-content-center">
          <h3 style="padding: 10px 0"><b>Регистрация</b></h3>
        </div>
        <form>
          <div class="d-flex justify-content-start">
            <div class="form-group w-100">
              <input type="text" v-model="credentials.name" name="name" class="form-control" placeholder="Имя">
              <span style="color: red" v-if="validationErrors.name.check">{{ validationErrors.name.message }}</span>
            </div>
          </div>
          <div class="d-flex justify-content-start">
            <div class="form-group w-100">
              <input type="email" v-model="credentials.email" name="email" class="form-control" placeholder="Email">
              <span style="color: red" v-if="validationErrors.email.check">{{ validationErrors.email.message }}</span>
            </div>
          </div>
          <div class="d-flex justify-content-start">
            <div class="form-group w-100">
              <input type="password" v-model="credentials.password" name="password" class="form-control" placeholder="Пароль">
              <span style="color: red" v-if="validationErrors.password.check">{{ validationErrors.password.message }}</span>
            </div>
          </div>
          <div class="d-flex justify-content-start">
            <div class="form-group w-100">
              <input type="password" v-model="credentials.password_confirmation" name="password_confirmation" class="form-control" placeholder="Повторение пароля">
              <span style="color: red" v-if="validationErrors.password_confirmation.check">{{ validationErrors.password_confirmation.message }}</span>
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <button @click.prevent="register" class="btn" style="background: #42b983; color: #fff;">Регистрация</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import authHelper from "../helpers/authHelper";
import methodsValidation from "../helpers/validateHelper";
import methodsApi from "../helpers/axiosHelper";

export default {
  name: "Register",
  data() {
    return {
      credentials: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      validationErrors: {
        name: {
          check: false,
          message: ''
        },
        email: {
          check: false,
          message: ''
        },
        password: {
          check: false,
          message: ''
        },
        password_confirmation: {
          check: false,
          message: ''
        }
      },
      serverResponse: false,
      serverResponseErrors: ''
    };
  },
  mounted() {
    authHelper.checkAuth();
  },
  methods: {
    register() {
      this.validationErrors.name.check = false;
      this.validationErrors.name.message = '';
      this.validationErrors.email.check = false;
      this.validationErrors.email.message = '';
      this.validationErrors.password.check = false;
      this.validationErrors.password.message = '';
      this.validationErrors.password_confirmation.check = false;
      this.validationErrors.password_confirmation.message = '';

      if (!methodsValidation.isRequired(this.credentials.name)) {
        this.validationErrors.name.check = true;
        this.validationErrors.name.message = 'Поле Имя обязательно к заполнению!';
      }

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
      } else if (!methodsValidation.minLength(this.credentials.password, 8)) {
        this.validationErrors.password.check = true;
        this.validationErrors.password.message = 'Поле Пароль должно быть больше 8 символов!';
      }

      if (!methodsValidation.isRequired(this.credentials.password_confirmation)) {
        this.validationErrors.password_confirmation.check = true;
        this.validationErrors.password_confirmation.message = 'Поле Повторение пароля обязательно к заполнению!';
      } else if (!methodsValidation.confirmation(this.credentials.password, this.credentials.password_confirmation)) {
        this.validationErrors.password_confirmation.check = true;
        this.validationErrors.password_confirmation.message = 'Пароли не совпадают!';
      }

      if (this.validationErrors.name.check ||
          this.validationErrors.email.check ||
          this.validationErrors.password.check ||
          this.validationErrors.password_confirmation.check
      ) {
        return;
      }

      methodsApi.postApi('user/register', this.credentials)
        .then(() => {
          this.serverResponse = false;
          this.$router.push({
            name: 'Auth'
          });
        })
        .catch(data => {
          this.serverResponse = true;
          if (data.response.status === 500) {
            this.serverResponseErrors = 'Произошла внутренняя ошибка сервера!';
          } else if (data.response.status === 422) {
            this.serverResponseErrors = 'Проверьте правильность введенных данных!';
            if (data.response.data.errors.email[0] === 'The email has already been taken.') {
              this.serverResponseErrors = 'Этот Email уже занят!';
            }
          } else {
            this.serverResponseErrors = 'Произошла непредвиденная ошибка!';
          }
        })
    }
  }
}
</script>

<style scoped>

</style>