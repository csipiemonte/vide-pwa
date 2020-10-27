<template>
  <div>
    <v-toolbar class="upSendFilesToolbar">
      <v-toolbar-title class="upSendFilesToolbartitle">
        <v-row justify="end">
          <v-col cols="auto" class="pa-0">
            <v-btn
              depressed
              :ripple="false"
              text
              @click.stop="$parent.$parent.uploadFileDrawer = false"
              class="close-button"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <strong>File</strong>
      </v-toolbar-title>
    </v-toolbar>
    <ErrorBox :error="detailError" />
    <v-form enctype="multipart/form-data" id="uploadFile" class="mt-12 pa-5">
      <v-file-input
        :accept="allowedFileExts"
        label="Seleziona file"
        @change="uploadFile()"
        v-model="mForm.file"
        browse-text="Sfoglia"
        :error-count="2"
        :error-messages="uploadErrors"
        outlined
        :show-size="1000"
      />
    </v-form>
    <div class="tabsSendFile">
      <v-tabs v-model="sendFileTabs" fixed-tabs>
        <v-tab>INVIATI</v-tab>
        <v-tab>RICEVUTI</v-tab>
      </v-tabs>
      <v-tabs-items v-model="sendFileTabs" class="pr-3 sendFileTab">
        <v-tab-item>
          <!-- inviati -->
          <v-list flat>
            <v-list-item-group v-if="sentFiles.length == 0">
              <v-list-item inactive>
                <v-row>
                  <v-col>Nessun file spedito.</v-col>
                </v-row>
              </v-list-item>
            </v-list-item-group>
            <v-list-item-group v-else>
              <v-list-item
                inactive
                :ripple="false"
                v-for="(item, index) in sentFiles"
                :key="index"
                class="file-upload-list"
              >
                <v-row align="center">
                  <v-col cols="auto" md="6" class="pl-0">
                    {{ item.filename }}
                  </v-col>
                  <v-col cols="auto" md="6" class="sentfiles text-right">
                    <v-row align="center" justify="end">
                      <v-col cols="auto">
                        <v-btn
                          text
                          class="actionBtn downloadBtn px-0"
                          @click="
                            downloadFile(item.attachment_id, item.filename)
                          "
                        >
                          SCARICA
                          <v-icon>mdi-download</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col cols="auto">
                        <v-dialog v-model="dialog" max-width="400">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              text
                              color="primary"
                              v-bind="attrs"
                              v-on="on"
                              class="actionBtn px-0"
                            >
                              ELIMINA
                              <v-icon color="error">mdi-delete</v-icon>
                            </v-btn>
                          </template>
                          <v-card>
                            <v-card-title class="headline"
                              >Confermi l'eliminazione del file?</v-card-title
                            >
                            <v-card-text>
                              <p>
                                Facendo click sul bottone
                                <strong>Elimina</strong> sarà rimosso il file e
                                non sarà più disponibile in questo appuntamento.
                              </p>
                              <strong>Si desidera procedere?</strong>
                            </v-card-text>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
                                outlined
                                @click="dialog = false"
                                color="primary"
                                >ANNULLA</v-btn
                              >
                              <v-btn
                                color="error"
                                @click="deleteFile(item.attachment_id)"
                                >ELIMINA</v-btn
                              >
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-tab-item>
        <v-tab-item>
          <p
            v-if="receivedFiles.length > 0 && uploadByUser"
            style="margin-left: 15px;"
          >
            <br />
            <strong>Attenzione</strong>: ricordati di scaricare i file inviati
            dall'operatore prima di chiudere la videochiamata.
          </p>
          <v-list flat>
            <v-list-item-group v-if="receivedFiles.length == 0">
              <v-list-item inactive>
                <v-row>
                  <v-col>Nessun file ricevuto.</v-col>
                </v-row>
              </v-list-item>
            </v-list-item-group>
            <v-list-item-group>
              <v-list-item
                inactive
                v-for="(item, index) in receivedFiles"
                :key="index"
              >
                <v-row align="center">
                  <v-col cols="9">
                    {{ item.filename }}
                  </v-col>
                  <v-col cols="3" class="sentfiles text-right">
                    <a
                      class="downloadBtn"
                      @click="downloadFile(item.attachment_id, item.filename)"
                    >
                      <span>SCARICA</span>
                      <v-icon>mdi-download</v-icon>
                    </a>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
      <div class="btnReload">
        <v-btn block outlined class="btnSecondary" @click="listAttachments()">
          <v-icon class="mr-2">
            mdi-reload
          </v-icon>
          ricarica
        </v-btn>
      </div>
    </div>
    <Spinner :pOverlay="isLoading" />
  </div>
</template>

<script>
import {
  ATTACHMENTS_FILES_EXTS,
  ATTACHMENTS_FILES_MAX_NUM,
  ATTACHMENTS_FILES_MAX_SIZE
} from "@/common/config";
import ErrorBox from "@/components/layout/ErrorBox";
import Spinner from "@/components/layout/Spinner";
import {
  ATTACHMENT_DELETE,
  ATTACHMENT_DOWNLOAD,
  ATTACHMENT_UPLOAD,
  ATTACHMENTS_FETCH
} from "@/store/actions.type";
import { saveAs } from "file-saver";
import { validationMixin } from "vuelidate";
import { mapGetters } from "vuex";

export default {
  name: "SendFiles",
  components: { ErrorBox, Spinner },
  props: {
    uploadByUser: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      allowedFileExts: ATTACHMENTS_FILES_EXTS,
      appAttachments: [],
      detailError: { message: "", title: "" },
      dialog: false,
      isLoading: false,
      maxNum: ATTACHMENTS_FILES_MAX_NUM,
      mForm: {
        file: null
      },
      uploadFileError: null,
      sendFileTabs: null
    };
  },
  computed: {
    ...mapGetters(["appointment"]),
    sentFiles() {
      const isUser = this.uploadByUser;
      return this.appAttachments.filter(p => p.uploadByUser == isUser);
    },
    receivedFiles() {
      const isUser = this.uploadByUser;
      return this.appAttachments.filter(p => p.uploadByUser != isUser);
    },
    uploadErrors() {
      const errors = [];
      if (!this.$v.mForm.file.$dirty) return errors;
      !this.$v.mForm.file.uploadFileFailed && errors.push(this.uploadFileError);
      this.sentFiles.length == this.maxNum &&
        errors.push("Hai raggiunto il numero massimo di documenti.");
      return errors;
    }
  },
  mixins: [validationMixin],
  validations: {
    mForm: {
      file: {
        uploadFileFailed: function() {
          return !(this.uploadFileError != null && this.uploadFileError !== "");
        }
      }
    }
  },
  methods: {
    checkFileSize(fileSize) {
      if (fileSize / 1024 / 1024 > ATTACHMENTS_FILES_MAX_SIZE) return false;
      return true;
    },

    checkFileExt(fileExt) {
      if (this.allowedFileExts.indexOf(fileExt) == -1) return false;
      return true;
    },
    uploadFile() {
      const upFile = this.mForm.file;
      this.uploadFileError = null;
      this.detailError = { message: "", title: "" };
      if (upFile == null) return;

      const fileExt = upFile.name.substr(upFile.name.lastIndexOf(".") + 1);
      if (!this.checkFileExt(fileExt))
        this.uploadFileError = "Il documento ha un'estensione non consentita.";
      if (!this.checkFileSize(upFile.size))
        this.uploadFileError =
          "Il documento ha una dimensione che supera quella consentita (" +
          UPLOAD_FILES_MAX_SIZE +
          "MB).";

      this.$v.mForm.file.$touch();
      if (this.$v.mForm.file.$invalid) return;

      var formData = new FormData();
      formData.append("slug", this.appointment.appointment_id);
      formData.append("upFile", upFile);
      formData.append("fileName", upFile.name);
      formData.append("uploadByUser", this.uploadByUser);

      this.isLoading = true;
      this.$store
        .dispatch(ATTACHMENT_UPLOAD, formData)
        .then(() => {
          this.isLoading = false;
          this.mForm.file = null;
          const VueThis = this;
          setTimeout(() => {
            VueThis.listAttachments();
          }, 2000);
        })
        .catch(error => {
          this.isLoading = false;
          switch (error.response.status) {
            case 400:
            case 401:
              this.detailError = {
                title: "Errore durante l'upload del file.",
                message:
                  "Il file non è stato inviato a causa di un errore interno " +
                  "(" +
                  error.message +
                  ")."
              };
              break;
            case 500:
              this.detailError = {
                title: "Errore durante l'upload del file.",
                message:
                  "Servizio non disponibile " + "(" + error.message + ")."
              };
              break;
          }
        });
    },

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

    deleteFile(fileId) {
      this.detailError = { message: "", title: "" };
      this.isLoading = true;
      const inputData = {
        appointment_id: this.appointment.appointment_id,
        attachment_id: fileId
      };
      this.$store
        .dispatch(ATTACHMENT_DELETE, inputData)
        .then(response => {
          const VueThis = this;
          setTimeout(() => {
            VueThis.listAttachments();
            this.isLoading = false;
          }, 2000);
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
                  "Impossibile eseguire l'eliminazione del file " +
                  "(" +
                  error.message +
                  ").",
                title: "Errore"
              };
              break;
          }
        });
    },

    listAttachments() {
      this.detailError = { message: "", title: "" };

      this.isLoading = true;
      this.$store
        .dispatch(ATTACHMENTS_FETCH, this.appointment.appointment_id)
        .then(response => {
          this.isLoading = false;
          if (response.data.length > 0) this.appAttachments = response.data;
        })
        .catch(error => {
          this.isLoading = false;
          if (error == null) {
            this.detailError = {
              message: "Servizio non disponibile",
              title: "Errore"
            };
            return;
          }
          switch (error.response.status) {
            case 400:
            case 401:
            case 500:
              this.detailError = {
                message:
                  "Impossibile ottenere l'elenco dei file inviati/ricevuti " +
                  "(" +
                  error.message +
                  ").",
                title: "Errore"
              };
              this.appAttachments = [];
              break;
            case 404:
              this.appAttachments = [];
              break;
          }
        });
    }
  },
  mounted() {
    this.listAttachments();
  }
};
</script>
