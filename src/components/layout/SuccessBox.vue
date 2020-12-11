<template>
  <v-alert
    class="mb-5"
    :class="type === 'successConfig' ? 'alertConfig text-left' : ''"
    border="left"
    type="success"
    :icon="false"
    aria-relevant="all"
    show
    id="succBoxCmp"
    tabindex="-1"
    v-if="success.message !== '' && success.title !== ''"
  >
    <v-row :class="type === 'successConfig' ? 'px-1' : 'pl-3'" align="start">
      <v-col cols="12" md="2" v-if="type !== 'successConfig'">
        <v-img
          width="40"
          :src="require(`@/assets/images/alert/success.svg`)"
          :lazy-src="require(`@/assets/images/alert/success.svg`)"
        />
      </v-col>
      <v-col
        cols="12"
        :md="type === 'successConfig' ? '12' : '10'"
        :class="type === 'successConfig' ? 'pa-0' : ''"
      >
        <h2
          class="alert-heading alertTitle"
          :class="type === 'successConfig' ? 'titleConfig' : ''"
        >
          <div v-if="type === 'successConfig'" class="d-inline-flex mr-2">
            <img
              :src="require(`@/assets/images/icon/camera_on.svg`)"
              class="mr-2"
            />
            <img :src="require(`@/assets/images/icon/speaker_on.svg`)" />
          </div>
          {{ success.title }}
        </h2>
        <p v-html="success.message" class="subtitle-text" />
      </v-col>
    </v-row>
  </v-alert>
</template>

<script>
export default {
  name: "SuccessBox",
  props: {
    success: { type: Object, required: true },
    type: { type: String }
  }
};
</script>
