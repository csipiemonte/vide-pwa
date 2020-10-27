<template>
  <div class="auth-page">
    <div class="container">
      <v-card class="mx-auto pa-16 mt-16" max-width="496">
        <div class="login-card">
          <ErrorBox :error="detailError" />
          <v-row align="center" justify="center" class="mb-5">
            <TenantLogo :pMaxWidth="149" />
          </v-row>
          <v-row align="center" justify="center">
            <v-card-title>
              Virtual Desk
            </v-card-title>
          </v-row>
          <v-card-subtitle class="text-center mb-6">
            Accedi con il codice Virtual Desk
          </v-card-subtitle>
          <v-card-text>
            <v-form @submit.prevent="joinViDe">
              <v-text-field
                clearable
                clear-icon="mdi-close-circle"
                label="Codice Virtual Desk"
                id="virtualDeskId"
                type="text"
                v-model="vdForm.virtualDeskCode"
                :counter="$v.vdForm.virtualDeskCode.$params.maxLength.max"
                :maxLength="$v.vdForm.virtualDeskCode.$params.maxLength.max"
                :error-messages="videErrors"
                autocomplete="off"
                :error-count="4"
                @change.native="resetServerErrors()"
              ></v-text-field>
              <v-btn type="submit" class="btnPrimary">
                Entra
              </v-btn>
            </v-form>
          </v-card-text>
        </div>
      </v-card>
    </div>
    <Spinner :pOverlay="isLoading" />
  </div>
</template>

<script>
import { VIRTUAL_DESK_ID_MAX_LENGTH } from "@/common/config";
import { isEmpty } from "@/common/utils";
import ErrorBox from "@/components/layout/ErrorBox";
import Spinner from "@/components/layout/Spinner";
import TenantLogo from "@/components/layout/TenantLogo";
import { USER_LOGIN, APPOINTMENT_SEARCH } from "@/store/actions.type";
import store from "@/store";
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  name: "Login",
  components: {
    ErrorBox,
    Spinner,
    TenantLogo
  },
  data() {
    return {
      detailError: { message: "", title: "" },
      isLoading: false,
      serverErrors: { virtualDeskCode: "" },
      vdForm: {
        virtualDeskCode: null
      }
    };
  },
  mixins: [validationMixin],
  validations: {
    vdForm: {
      virtualDeskCode: {
        required,
        maxLength: maxLength(VIRTUAL_DESK_ID_MAX_LENGTH),
        serverValidOk: function() {
          return this.serverErrors.virtualDeskCode == "";
        }
      }
    }
  },
  computed: {
    videErrors() {
      const errors = [];
      if (!this.$v.vdForm.virtualDeskCode.$dirty) return errors;
      !this.$v.vdForm.virtualDeskCode.required &&
        errors.push("Il codice del Virtual Desk è obbligatorio.");
      !this.$v.vdForm.virtualDeskCode.maxLength &&
        errors.push(
          "Il codice del Virtual Desk deve avere una lunghezza massima di 36 caratteri."
        );
      !this.$v.vdForm.virtualDeskCode.serverValidOk &&
        errors.push(this.serverErrors.virtualDeskCode);
      return errors;
    }
  },
  methods: {
    joinViDe() {
      this.$v.$touch();
      if (this.$v.$invalid) return;

      this.isLoading = true;
      store
        .dispatch(APPOINTMENT_SEARCH, {
          filter: { virtual_desk_id: { eq: this.vdForm.virtualDeskCode } }
        })
        .then(({ data }) => {
          this.isLoading = false;
          if (data == "") {
            this.serverErrors.virtualDeskCode =
              "Codice Virtual Desk non trovato.";
            return;
          }
          this.$router.push({ path: `/user/start/${data[0].appointment_id}` });
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
    }
  },
  created() {
    const route = this.$route;
    if (!isEmpty(route.params.slug)) {
      this.vdForm.virtualDeskCode = route.params.slug;
      this.joinViDe();
    } else {
      this.detailError = {
        title: "Dati mancanti.",
        message:
          "Dati incompleti, impossibile eseguire la ricerca dell'appuntamento."
      };
    }
  },
  resetServerErrors() {
    this.serverErrors = { virtualDeskCode: "" };
  }
};
</script>
