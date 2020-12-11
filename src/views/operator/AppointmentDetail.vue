<template>
  <div class="container pt-8">
    <v-card class="px-8 py-8 mx-auto card-detailApp" max-width="684px">
      <ErrorBox :error="detailError" />
      <v-card-title>
        Dettaglio appuntamento
      </v-card-title>
      <v-list class="dettaglio-appuntamento mb-8">
        <v-list-item>
          <v-row>
            <v-col cols="3">
              Utente
            </v-col>
            <v-col>
              <strong
                >{{ appointment.user.name }}
                {{ appointment.user.surname }}</strong
              >
            </v-col>
          </v-row>
        </v-list-item>
        <v-list-item>
          <v-row>
            <v-col cols="3">
              Contatti utente
            </v-col>
            <v-col
              ><strong>{{ phone }}</strong> (telefono) -
              <strong>{{ email }}</strong> (e-mail)</v-col
            >
          </v-row>
        </v-list-item>
        <v-list-item>
          <v-row>
            <v-col cols="3">
              URL stanza utente
            </v-col>
            <v-col
              ><strong>{{ videJoinUrl }}</strong></v-col
            >
          </v-row>
        </v-list-item>
        <v-list-item>
          <v-row>
            <v-col cols="3">
              Inizio
            </v-col>
            <v-col>
              <strong>{{ formatDate(appointment.begin_date) }}</strong>
            </v-col>
          </v-row>
        </v-list-item>
        <v-list-item>
          <v-row>
            <v-col cols="3">
              Fine
            </v-col>
            <v-col>
              <strong>{{ formatDate(appointment.end_date) }}</strong>
            </v-col>
          </v-row>
        </v-list-item>
        <v-list-item>
          <v-row>
            <v-col cols="3">
              Sportello
            </v-col>
            <v-col>
              <strong
                v-if="
                  appointment.front_office_name != null &&
                    appointment.front_office_name != ''
                "
                >{{ appointment.front_office_name }}</strong
              >
              <strong v-else>N.D.</strong>
            </v-col>
          </v-row>
        </v-list-item>
        <v-list-item>
          <v-row>
            <v-col cols="3">
              Note
            </v-col>
            <v-col>
              <strong>{{ notes }}</strong>
            </v-col>
          </v-row>
        </v-list-item>
        <v-list-item>
          <v-row>
            <v-col cols="3">
              Doc. inviati
            </v-col>
            <v-col>
              <div v-if="sentFiles.length == 0">
                <strong>Nessun file spedito</strong>
              </div>
              <div v-else>
                <ul>
                  <li v-for="(item, index) in sentFiles" :key="index">
                    <a
                      href="#"
                      v-on:click="
                        downloadFile(item.attachment_id, item.filename)
                      "
                    >
                      <strong>{{ item.filename }}</strong>
                    </a>
                  </li>
                </ul>
              </div>
            </v-col>
          </v-row>
        </v-list-item>
        <v-list-item>
          <v-row>
            <v-col cols="3">
              Doc. ricevuti
            </v-col>
            <v-col>
              <div v-if="receivedFiles.length == 0">
                <strong>Nessun file ricevuto</strong>
              </div>
              <div v-else>
                <ul>
                  <li v-for="(item, index) in receivedFiles" :key="index">
                    <a
                      href="#"
                      v-on:click="
                        downloadFile(item.attachment_id, item.filename)
                      "
                    >
                      <strong>{{ item.filename }}</strong>
                    </a>
                  </li>
                </ul>
              </div>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-btn
          :to="{
            name: 'operator-appointment',
            params: { slug: appointment.appointment_id }
          }"
          class="btnPrimary btn--Large"
          v-if="validAppointment"
          target="_blank"
          >Inizia la chiamata</v-btn
        >
        <v-btn
          :to="{
            name: 'operator-appointment',
            params: { slug: appointment.appointment_id }
          }"
          class="btnPrimary btn--Large"
          v-if="openAppointment"
          target="_blank"
          >Riprendi la chiamata</v-btn
        >
        <div v-if="closedAppointment" class="fontSemibold">
          La chiamata è terminata
        </div>
        <div v-if="deletedAppointment" class="fontSemibold">
          La chiamata è annullata
        </div>
      </v-card-actions>
    </v-card>
    <Spinner :pOverlay="isLoading" />
  </div>
</template>

<script>
import moment from "moment-timezone";
import { mapGetters } from "vuex";
import { saveAs } from "file-saver";
import {
  APPOINTMENT_CONFIRMED,
  APPOINTMENT_OPEN,
  APPOINTMENT_CLOSED,
  APPOINTMENT_DELETED,
  USER_JOIN_VIDE_URL,
  X_AUTH_ROLE_OPERATOR
} from "@/common/config";
import { getHostname } from "@/common/utils";
import ErrorBox from "@/components/layout/ErrorBox";
import Spinner from "@/components/layout/Spinner";
import store from "@/store";
import {
  APPOINTMENT_FETCH,
  ATTACHMENT_DOWNLOAD,
  ATTACHMENTS_FETCH
} from "@/store/actions.type";

export default {
  name: "AppointmentDetail",
  data() {
    return {
      appAttachments: [],
      detailError: { message: "", title: "" },
      isLoading: false,
      uploadByUser: false
    };
  },
  components: { ErrorBox, Spinner },
  computed: {
    ...mapGetters(["appointment"]),
    email: function() {
      if (
        this.appointment.user.email != undefined &&
        this.appointment.user.email != null
      )
        return this.appointment.user.email;
      return "N.D.";
    },
    notes: function() {
      if (this.appointment.notes != undefined && this.appointment.notes != null)
        return this.appointment.notes;
      return "N.D.";
    },
    phone: function() {
      if (
        this.appointment.user.phone != undefined &&
        this.appointment.user.phone != null
      )
        return this.appointment.user.phone;
      return "N.D.";
    },
    videJoinUrl: function() {
      return USER_JOIN_VIDE_URL + this.appointment.virtual_desk.virtual_desk_id;
    },
    validAppointment: function() {
      return this.appointment.status == APPOINTMENT_CONFIRMED;
    },
    openAppointment: function() {
      return this.appointment.status == APPOINTMENT_OPEN;
    },
    closedAppointment: function() {
      return this.appointment.status == APPOINTMENT_CLOSED;
    },
    deletedAppointment: function() {
      return this.appointment.status == APPOINTMENT_DELETED;
    },
    sentFiles() {
      return this.appAttachments.filter(p => p.uploadByUser == false);
    },
    receivedFiles() {
      return this.appAttachments.filter(p => p.uploadByUser == true);
    }
  },
  methods: {
    downloadFile(fileId, fileName) {
      this.detailError = { message: "", title: "" };
      this.isLoading = true;
      const inputData = {
        appointment_id: this.appointment.appointment_id,
        attachment_id: fileId
      };
      this.$store
        .dispatch(ATTACHMENT_DOWNLOAD, inputData)
        .then(response => {
          this.isLoading = false;
          const blob = new Blob([response.data]);
          saveAs(blob, fileName);
        })
        .catch(error => {
          this.isLoading = false;
          switch (error.response.status) {
            case 400:
            case 401:
            case 404:
            case 500:
              this.detailError = {
                message:
                  "Impossibile eseguire lo scaricamento del file " +
                  "(" +
                  error.message +
                  ").",
                title: "Errore"
              };
              break;
          }
        });
    },
    formatDate(inputDate) {
      return moment.utc(inputDate).format("DD/MM/YYYY HH:mm");
    },
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
          this.isLoading = false;
          this.listAttachments();
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
    listAttachments() {
      if (
        this.appointment.appointment_id == undefined ||
        this.appointment.appointment_id == null
      )
        return;
      this.detailError = { message: "", title: "" };

      this.isLoading = true;
      store
        .dispatch(ATTACHMENTS_FETCH, this.appointment.appointment_id)
        .then(response => {
          this.isLoading = false;
          if (response.data.length > 0) this.appAttachments = response.data;
        })
        .catch(error => {
          this.isLoading = false;

          switch (error.response.status) {
            case 404:
              this.appAttachments = [];
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
