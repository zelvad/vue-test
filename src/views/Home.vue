<template>
  <div id="home">
    <div class="container">
      <div class="row d-flex justify-content-center">
        <div class="col-lg-12">
          <div class="mb-4">
            <h3><b>Введите ссылку для предпросмотра</b></h3>
          </div>
        </div>
        <div class="col-lg-12">
          <preview></preview>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Preview from "../components/Preview";

export default {
  name: "Home",
  components: {Preview}
}
</script>

<style scoped>

</style>