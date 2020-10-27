<template>
  <v-overlay :value="pOverlay">
    <v-progress-circular indeterminate size="64"></v-progress-circular>
  </v-overlay>
</template>

<script>
export default {
  name: "Spinner",
  props: {
    pOverlay: { type: Boolean, required: true }
  }
};
</script>
