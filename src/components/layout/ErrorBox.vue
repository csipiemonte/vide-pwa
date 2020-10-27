<template>
  <v-alert
    class="mb-5"
    border="left"
    type="error"
    icon="mdi-alert-circle-outline"
    aria-relevant="all"
    show
    id="errBoxCmp"
    tabindex="-1"
    v-if="this.error.message !== '' && this.error.title !== ''"
  >
    <h4 class="alert-heading">
      {{ this.error.title }}
    </h4>
    <p>{{ this.error.message }}</p>
  </v-alert>
</template>

<script>
export default {
  name: "ErrorBox",
  props: {
    error: { type: Object, required: true }
  }
};
</script>
