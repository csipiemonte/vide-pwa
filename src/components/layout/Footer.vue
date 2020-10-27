<template>
  <v-footer
    id="footer"
    color="#f0f3f8"
    v-show="
      $route.name !== 'operator-appointment' &&
        $route.name !== 'user-appointment' &&
        $route.name !== 'user-start-appointment'
    "
  >
    <div class="container">
      <v-row align="center">
        <v-col md="6" align-self="center">
          <p class="mb-0">VIDE v. {{ pwaVersion }}</p>
        </v-col>
        <v-col md="6">
          <v-row justify="end">
            <v-img
              max-width="135"
              :src="require('@/assets/images/csi.png')"
              alt="CSI Piemonte"
              fluid
            />
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-footer>
</template>

<script>
import { version } from "../../../package.json";

export default {
  name: "Footer",
  computed: {
    pwaVersion: function() {
      return version;
    }
  }
};
</script>
