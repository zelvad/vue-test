<template>
  <div id="search">
    <div class="row d-flex justify-content-center">
      <div class="col-lg-6">
        <div class="errors" v-if="serverResponse">
          <div class="alert-danger alert">{{ serverResponseErrors }}</div>
        </div>
      </div>
    </div>
    <div class="row d-flex justify-content-center">
      <div class="col-lg-6">
        <div class="form-group">
        </div>
        <div class="form-group">
          <input type="text" v-model="credentials.url" class="form-control" placeholder="https://example.com">
          <span style="color: red" v-if="validationErrors.url.check">{{ validationErrors.url.message }}</span>
        </div>
      </div>
      <div class="col-lg-1">
        <button @click.prevent="getPreview" class="btn btn-search">Загрузить</button>
      </div>
    </div>
  </div>
  <div id="list" v-if="previews.load" style="margin-bottom: 50px">
    <div class="row d-flex justify-content-center">
      <div class="col-lg-8 m-5" style="margin-bottom: 0 !important;">
        <h3>Ваши история ссылок</h3>
        <div class="border preview-item m-4" v-for="(preview, id) in previews.list" :key="id">
          <div class="row">
            <div class="col-lg-3 d-flex justify-content-center align-items-center" v-if="preview.image" style="padding-right: 0;">
              <img v-bind:src="preview.image" alt="Image">
            </div>
            <div class="col-lg-9" style="padding-left: 0">
              <div class="form-group text-left m-4" style="margin-left: 0 !important;">
                <div>
                  <a href="{{ preview.url }}">{{ preview.url }}</a>
                </div>
                <div>
                  <a href="#"><b>{{ preview.author }}</b></a>
                </div>
                <div>
                  <b>{{ preview.title }}</b>
                </div>
                <div>
                  {{ preview.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row d-flex justify-content-center" v-if="!previewsPagination.disable">
      <a :style="[(previewsPagination.prev_page_url == null) ? {'opacity': '0.5', 'cursor': 'no-drop'} : {}]" class="prev btn" @click.prevent="getPreviewsList('prev')">Назад</a>
      <a :style="[(previewsPagination.next_page_url == null) ? {'opacity': '0.5', 'cursor': 'no-drop'} : {}]" class="next btn" @click.prevent="getPreviewsList('next')">Дальше</a>
    </div>
  </div>
</template>

<script>
import methodsValidation from "../helpers/validateHelper";
import methodsApi from "../helpers/axiosHelper";
import authHelper from "../helpers/authHelper";
import axios from "axios";
import axiosHelper from "../helpers/axiosHelper";

export default {
  name: "Preview",
  data () {
    return {
      credentials: {
        url: ''
      },
      validationErrors: {
        url: {
          check: false,
          message: ''
        }
      },
      previews: {
        list: {},
        load: false
      },
      previewsPagination: {
        next_page_url: 'previews/list',
        prev_page_url: '',
        disable: false
      },
      serverResponse: false,
      serverResponseErrors: ''
    };
  },
  mounted() {
    this.getPreviewsList('next')
  },
  methods: {
    getPreview() {
      this.validationErrors.url.check = false;
      this.validationErrors.url.message = '';

      if (!methodsValidation.isValidUrl(this.credentials.url)) {
        this.validationErrors.url.check = true;
        this.validationErrors.url.message = 'URL должен быть в формате https://example.com.';
      }

      if (this.validationErrors.url.check) return;

      methodsApi.postApi('previews/create', this.credentials, {
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        })
        .then(data => {
          if (!this.isAuth()) {
            this.previews.load = true;
            this.previews.list = [data.data];
            this.previewsPagination.disable = true;
          } else {
            this.serverResponse = false;
            this.previewsPagination.next_page_url = 'previews/list';
            this.getPreviewsList('next');
          }
        })
        .catch(data => {
          this.serverResponse = true;
          if (data.response.status === 500) {
            this.serverResponseErrors = 'Произошла внутренняя ошибка сервера!';
          } else if (data.response.status === 422) {
            this.serverResponseErrors = 'Проверьте правильность введенных данных!';
          } else if (data.response.status === 429) {
            this.serverResponseErrors = 'Превышен лимит попыток!';
          } else {
            this.serverResponseErrors = 'Произошла непредвиденная ошибка!';
          }
        });
    },
    getPreviewsList(type) {
      let link;

      if (type === 'prev') {
        link = this.previewsPagination.prev_page_url;
      } else if (type === 'next') {
        link = this.previewsPagination.next_page_url;
      }

      link = link.replace(axiosHelper.baseUrl, '');

      if (authHelper.isAuth() && link !== null) {
            axios.get(link, {
              headers: {
                'Authorization': 'Bearer ' + this.$store.state.token
              }
            })
            .then(data => {
              this.previews.load = true;
              this.previews.list = data.data.data;
              this.previewsPagination.next_page_url = data.data.next_page_url;
              this.previewsPagination.prev_page_url = data.data.prev_page_url;
            }).catch(() => {
              this.previews.load = false;
              this.previews.list = {};
            });
      }
    },
    isAuth () {
      return authHelper.isAuth();
    },
  }
}
</script>

<style scoped>
  #search .btn-search {
    background: #42b983;
    color: #fff;
    margin-top: 15px;
  }
  #list .preview-item img {
    width: 80%;
    padding: 20px;
    box-sizing: border-box;
  }
  #list .prev {
    background: #42b983;
    color: #fff;
    border-radius: 3px 0 0 3px;
    border-right: 1px solid #fff;
  }
  #list .next {
    background: #42b983;
    color: #fff;
    border-radius: 0 3px 3px 0;
  }
</style>