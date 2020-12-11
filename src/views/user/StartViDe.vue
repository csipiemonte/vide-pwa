<template>
  <div class="container startVide">
    <div class="row">
      <ErrorBox :error="detailError" />
      <div
        class="col-md-12 text-center"
        v-if="
          appointment.status == OPEN_STATUS ||
            appointment.status == CONFIRMED_STATUS
        "
      >
        <h2 class="mb-5 mt-5">
          <span class="font-regular">Buongiorno</span>
          {{ appointment.user.name }} {{ appointment.user.surname
          }}<span class="font-regular">!</span>
        </h2>
        <div class="descriptionVide">
          <p class="mb-0">
            Hai un appuntamento
            <span v-if="!isCoto"
              >con lo sportello
              <strong> {{ appointment.front_office_name }}</strong></span
            >
            il <strong>{{ formatDate(appointment.begin_date) }}</strong>
            alle ore
            <strong>{{ formatHour(appointment.begin_date) }}</strong
            >.
          </p>
          <p v-if="appointment.status == CONFIRMED_STATUS">
            Potrai iniziare la videochiamata appena il pulsante sottostante sarà
            attivo.<br />
            Per ingannare l'attesa puoi verificare che il tuo dispositivo sia
            correttamente configurato facendo click
            <a @click="modalMedia = true">qui</a>.
            <UserMedia
              ref="userMedia"
              v-if="modalMedia"
              v-on:closecard="modalMedia = false"
            />
          </p>
          <div
            class="text-center"
            v-if="progressCircularOn && appointment.status == CONFIRMED_STATUS"
          >
            <v-progress-circular
              indeterminate
              :size="50"
              color="primary"
            ></v-progress-circular>
          </div>
          <p
            v-if="progressCircularOn && appointment.status == CONFIRMED_STATUS"
            class="progressCircularText"
          >
            Ancora pochi minuti e ti sarà possibile iniziare la videochiamata.
          </p>
          <p
            v-if="appointment.status == OPEN_STATUS"
            class="progressCircularText"
          >
            Clicca sul bottone qui sotto per iniziare la videochiamata.
          </p>
        </div>
        <v-btn
          :to="{
            name: 'user-appointment',
            params: { slug: appointment.appointment_id }
          }"
          :disabled="!(appointment.status == OPEN_STATUS)"
          class="btnPrimary mt-5 btn--Large"
          >Inizia la videochiamata</v-btn
        >
      </div>
      <div class="col-md-12 text-center" v-else>
        <h2 class="mb-5 mt-5">
          <span class="font-regular">Buongiorno</span>
          {{ appointment.user.name }} {{ appointment.user.surname
          }}<span class="font-regular">!</span>
        </h2>
        <div class="descriptionVide">
          <p v-html="descrClosedAppointment" />
          <p>
            La invitiamo a procedere con un'altra prenotazione.
          </p>
        </div>
      </div>
    </div>
    <v-row v-if="isCoto || carouselItems.length > 0">
      <v-col cols="12" lg="11" class="mx-auto">
        <v-card class="mt-15 cardServizi">
          <v-carousel
            cycle
            hide-delimiter-background
            show-arrows-on-hover
            height="320"
            class="carousel-servizi"
          >
            <v-carousel-item
              v-for="(slide, i) in carouselItems"
              :alt="slide.imageAlt"
              :key="i"
              :src="slide.image"
              height="100%"
            >
              <v-row class="row-carousel" align-content="end">
                <v-col cols="auto" class="column-carousel px-15">
                  <v-btn
                    class="link-active"
                    :ripple="false"
                    text
                    depressed
                    color="dark"
                    :href="slide.link"
                    target="_blank"
                  >
                    {{ slide.linkText }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-carousel-item>
          </v-carousel>
        </v-card>
      </v-col>
    </v-row>
    <Spinner :pOverlay="isLoading" />
  </div>
</template>

<script>
import moment from "moment-timezone";
import { CHECK_START_FREQ } from "@/common/config";
import ErrorBox from "@/components/layout/ErrorBox";
import Spinner from "@/components/layout/Spinner";
import UserMedia from "@/components/user/UserMedia";
import store from "@/store";
import { mapGetters } from "vuex";
import {
  APPOINTMENT_CONFIRMED,
  APPOINTMENT_OPEN,
  X_AUTH_ROLE_USER
} from "@/common/config";
import { APPOINTMENT_FETCH, FETCH_TENANT_CAROUSEL } from "@/store/actions.type";

export default {
  name: "StartViDe",
  data() {
    return {
      appointmentId: "",
      carouselItems: [],
      detailError: { message: "", title: "" },
      isLoading: false,
      modalMedia: false,
      modalMediaFirstTime: false,
      CONFIRMED_STATUS: APPOINTMENT_CONFIRMED,
      OPEN_STATUS: APPOINTMENT_OPEN
    };
  },
  components: { ErrorBox, Spinner, UserMedia },
  computed: {
    ...mapGetters(["appointment"]),
    descrClosedAppointment() {
      return (
        "L'appuntamento con lo sportello <strong>" +
        this.appointment.front_office_name +
        "</strong> a cui tentanto di accedere è in stato <strong>CHIUSO</strong>."
      );
    },
    progressCircularOn() {
      const now = new Date();
      const beginDate = new Date(this.appointment.begin_date);
      return now >= beginDate;
    }
  },
  methods: {
    fetchAppointment() {
      const inputParams = {
        xAuthRole: X_AUTH_ROLE_USER
      };
      inputParams.appointmentId = this.appointmentId;
      this.isLoading = true;

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
                title: "Errore durante la ricerca dell'appuntamento.",
                message:
                  "Non è possibile accedere all'appuntamento a causa di un errore interno " +
                  "(" +
                  error.message +
                  ")."
              };
              break;
            case 500:
              this.detailError = {
                title: "Errore durante la ricerca dell'appuntamento.",
                message:
                  "Servizio non disponibile " + "(" + error.message + ")."
              };
              break;
          }
        });
    },
    checkStartAppointment() {
      const VueThis = this;

      setTimeout(function() {
        VueThis.fetchAppointment();
        VueThis.checkStartAppointment();
      }, CHECK_START_FREQ * 1000);
    },
    formatDate(inputDate) {
      const dateString = moment
        .utc(inputDate)
        .locale("it")
        .format("DD MMMM YYYY");
      if (dateString.charAt(0) == "0") return dateString.slice(1);
      return dateString;
    },
    formatHour(inputDate) {
      const fH = moment.utc(inputDate).format("HH:mm");
      if (fH.charAt(0) == "0") return fH.slice(1);
      return fH;
    },
    fetchCarousel() {
      this.isLoading = true;
      store
        .dispatch(FETCH_TENANT_CAROUSEL)
        .then(({ data }) => {
          this.carouselItems = data;
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
        });
    },
    openUserMediaModal() {
      this.modalMedia = true;
      if (!this.modalMediaFirstTime) this.$refs.userMedia.playAudioVideo();
      this.modalMediaFirstTime = false;
    }
  },
  async mounted() {
    this.appointmentId = this.$route.params.slug;
    this.fetchAppointment();
    this.checkStartAppointment();
    this.fetchCarousel();
  }
};
</script>
