<template>
  <v-alert
    class="w-100"
    :class="type === 'errorConfig' ? 'alertConfig text-left' : ''"
    border="left"
    type="error"
    aria-relevant="all"
    :icon="false"
    show
    id="errBoxCmp"
    tabindex="-1"
    v-if="error.message !== '' && error.title !== ''"
  >
    <v-row :class="type === 'errorConfig' ? 'px-1' : 'pl-3'" align="start">
      <v-col cols="12" md="2" v-if="type !== 'errorConfig'">
        <v-img
          width="40"
          :src="require(`@/assets/images/alert/alert.svg`)"
          :lazy-src="require(`@/assets/images/alert/alert.svg`)"
        />
      </v-col>
      <v-col
        cols="12"
        :md="type === 'errorConfig' ? '12' : '10'"
        :class="type === 'errorConfig' ? 'pa-0' : ''"
      >
        <h2
          class="alert-heading alertTitle"
          :class="type === 'errorConfig' ? 'titleConfig' : ''"
        >
          <div v-if="type === 'errorConfig'" class="d-inline-flex mr-2">
            <img
              :src="require(`@/assets/images/icon/camera_off.svg`)"
              class="mr-2"
            />
            <img :src="require(`@/assets/images/icon/speaker_off.svg`)" />
          </div>
          {{ error.title }}
        </h2>
        <p v-html="error.message" class="subtitle-text" />
      </v-col>
    </v-row>
  </v-alert>
</template>

<script>
export default {
  name: "ErrorBox",
  props: {
    error: { type: Object, required: true },
    type: { type: String }
  }
};
</script>
