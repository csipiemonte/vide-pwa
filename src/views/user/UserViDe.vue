<template>
  <div class="home-page">
    <v-container fluid>
      <ErrorBox :error="detailError" />
      <VirtualDesk
        :isUser="true"
        :confLocalEmail="appointment.user.email"
        :confLocalName="appointment.user.name + ' ' + appointment.user.surname"
        :confRoomName="appointment.virtual_desk.conference_id"
        :confRoomTitle="appointment.virtual_desk.virtual_desk_id"
        :jwt="appointmentJwt"
        v-on:hangup="goToGreetingsPage($event)"
      />
    </v-container>
    <Spinner :pOverlay="isLoading" />
  </div>
</template>

<script>
import store from "@/store";
import { mapGetters } from "vuex";
import { X_AUTH_ROLE_USER } from "@/common/config";
import VirtualDesk from "@/components/common/VirtualDesk";
import ErrorBox from "@/components/layout/ErrorBox";
import Spinner from "@/components/layout/Spinner";
import { APPOINTMENT_FETCH } from "@/store/actions.type";

export default {
  name: "UserVide",
  data() {
    return {
      detailError: { message: "", title: "" },
      isLoading: false
    };
  },
  components: { ErrorBox, Spinner, VirtualDesk },
  computed: {
    ...mapGetters(["appointment", "appointmentJwt"])
  },
  methods: {
    getAppointment() {
      this.isLoading = true;
      const slug = this.$route.params.slug;
      const inputParams = {
        appointmentId: slug,
        xAuthRole: X_AUTH_ROLE_USER
      };
      store
        .dispatch(APPOINTMENT_FETCH, inputParams)
        .then(() => {
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
          switch (error.response.status) {
            case 400:
            case 401:
            case 404:
              this.detailError = {
                title: "Errore durante il prelievo dell'appuntamento.",
                message:
                  "L'appuntamento non è stato aperto a causa di un errore interno " +
                  "(" +
                  error.message +
                  ")."
              };
              break;
            case 500:
              this.detailError = {
                title: "Errore durante il prelievo dell'appuntamento.",
                message:
                  "Servizio non disponibile " + "(" + error.message + ")."
              };
              break;
          }
        });
    },
    goToGreetingsPage() {
      this.$router.push({ name: "user-stop-appointment" });
    }
  }
};
</script>
