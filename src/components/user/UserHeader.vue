<template>
  <v-app-bar
    color="white"
    id="headerVide"
    :flat="
      $route.name !== 'user-appointment' &&
      $route.name !== 'user-start-appointment'
        ? false
        : true
    "
  >
    <v-row align="center">
      <v-col md="auto" class="logoHeader py-0">
        <TenantLogo :pMaxWidth="149" />
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="auto" class="serviceInfo py-0 text-center">
        <v-img
          :src="require('@/assets/images/vide.svg')"
          alt="VIDE, Your Virtual Desk"
          max-width="95.58"
          fluid
          class="mx-auto"
        />
      </v-col>
      <v-spacer></v-spacer>
      <div v-if="appointment.user !== undefined && appointment.user !== null">
        <v-col cols="auto" class="userInfo py-0">
          <span class="loginHeaderMenu userLogin">
            {{ appointment.user.name }} {{ appointment.user.surname }}
          </span>
        </v-col>
      </div>
    </v-row>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex";
import TenantLogo from "@/components/layout/TenantLogo";

export default {
  name: "UserHeader",
  components: {
    TenantLogo
  },
  computed: {
    ...mapGetters(["appointment"])
  }
};
</script>
