<template>
  <v-app-bar
    color="white"
    id="headerVide"
    :flat="$route.name !== 'operator-appointment' ? false : true"
  >
    <v-row align="center">
      <v-col md="auto" class="logoHeader py-0">
        <router-link :to="{ name: 'home' }">
          <TenantLogo :pMaxWidth="149" />
        </router-link>
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
      <div v-if="!ifOperatorAuthenticated">
        <!-- <router-link :to="{ name: 'home' }">
          VIrtual DEsk
        </router-link> -->
        <v-col>
          <router-link :to="{ name: 'operator-login' }">
            Login operatore
          </router-link>
        </v-col>
      </div>
      <div v-else>
        <v-col cols="auto" class="userInfo py-0">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <span class="loginHeaderMenu"
                  >{{ currentOperator.name }}
                  {{ currentOperator.surname }}</span
                >
                <v-btn
                  fab
                  class="btnPrimary loginBtnMenu ml-1"
                  x-small
                  depressed
                >
                  {{ currentOperator.name.substring(0, 1)
                  }}{{ currentOperator.surname.substring(0, 1) }}
                </v-btn>
              </div>
            </template>
            <v-card class="logOutBtn">
              <v-btn @click="onLogout" text block>
                <v-icon left>mdi-logout</v-icon> Esci
              </v-btn>
            </v-card>
          </v-menu>
        </v-col>
      </div>
    </v-row>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex";
import { logout } from "@/common/session";
import TenantLogo from "@/components/layout/TenantLogo";
export default {
  name: "OperatorHeader",
  components: {
    TenantLogo
  },
  computed: {
    ...mapGetters(["currentOperator", "ifOperatorAuthenticated"])
  },
  methods: {
    onLogout() {
      logout();
    }
  }
};
</script>
