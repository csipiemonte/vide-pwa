<template>
  <v-img
    v-if="tenantLayout.tenantLogo != undefined"
    :max-width="pMaxWidth"
    :src="tenantLayout.tenantLogo"
    fluid
  />
  <v-img
    v-else
    :max-width="pMaxWidth"
    :src="require('@/assets/images/csi.png')"
    fluid
  />
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TenantLogo",
  props: {
    pMaxWidth: { type: Number, required: false }
  },
  computed: {
    ...mapGetters(["tenantLayout"])
  }
};
</script>
