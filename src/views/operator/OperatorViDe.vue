<template>
  <div class="home-page">
    <v-container fluid>
      <ErrorBox :error="detailError" />
      <VirtualDesk
        :isUser="false"
        :confLocalName="currentOperator.name + ' ' + currentOperator.surname"
        :confRoomName="appointment.virtual_desk.conference_id"
        :confRoomTitle="appointment.virtual_desk.virtual_desk_id"
        :jwt="appointmentJwt"
        v-on:hangup="closeAppointment($event)"
      />
    </v-container>
    <Spinner :pOverlay="isLoading" />
  </div>
</template>

<script>
import store from "@/store";
import { mapGetters } from "vuex";
import {
  APPOINTMENT_CLOSED,
  APPOINTMENT_OPEN,
  X_AUTH_ROLE_OPERATOR
} from "@/common/config";
import ErrorBox from "@/components/layout/ErrorBox";
import Spinner from "@/components/layout/Spinner";
import VirtualDesk from "@/components/common/VirtualDesk";
import { APPOINTMENT_FETCH, APPOINTMENT_UPDATE } from "@/store/actions.type";

export default {
  name: "OperatorVide",
  data() {
    return {
      detailError: { message: "", title: "" },
      isLoading: false
    };
  },
  components: { ErrorBox, Spinner, VirtualDesk },
  computed: {
    ...mapGetters(["appointment", "currentOperator", "appointmentJwt"])
  },
  methods: {
    getAppointment() {
      this.isLoading = true;
      const slug = this.$route.params.slug;
      const inputParams = {
        appointmentId: slug,
        xAuthRole: X_AUTH_ROLE_OPERATOR
      };
      store
        .dispatch(APPOINTMENT_FETCH, inputParams)
        .then(() => {
          this.openAppointment();
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
    openAppointment() {
      if (this.appointment.status == APPOINTMENT_OPEN) {
        this.isLoading = false;
        return;
      }
      store
        .dispatch(APPOINTMENT_UPDATE, {
          slug: this.appointment.appointment_id,
          status: APPOINTMENT_OPEN
        })
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
                title: "Errore durante l'apertura dell'appuntamento.",
                message:
                  "L'appuntamento non è stato aperto a causa di un errore interno " +
                  "(" +
                  error.message +
                  ")."
              };
              break;
            case 500:
              this.detailError = {
                title: "Errore durante l'apertura dell'appuntamento.",
                message:
                  "Servizio non disponibile " + "(" + error.message + ")."
              };
              break;
          }
        });
    },
    closeAppointment() {
      this.isLoading = true;
      store
        .dispatch(APPOINTMENT_UPDATE, {
          slug: this.appointment.appointment_id,
          status: APPOINTMENT_CLOSED
        })
        .then(() => {
          this.$router.push({ name: "appointment-detail" });
        })
        .catch(error => {
          this.isLoading = false;
          switch (error.response.status) {
            case 400:
            case 401:
            case 404:
              this.detailError = {
                title: "Errore durante la chiusura dell'appuntamento.",
                message:
                  "L'appuntamento non è stato chiuso a causa di un errore interno " +
                  "(" +
                  error.message +
                  ")."
              };
              break;
            case 500:
              this.detailError = {
                title: "Errore durante la chiusura dell'appuntamento.",
                message:
                  "Servizio non disponibile " + "(" + error.message + ")."
              };
              break;
          }
        });
    }
  },
  mounted() {
    this.getAppointment();
  }
};
</script>
