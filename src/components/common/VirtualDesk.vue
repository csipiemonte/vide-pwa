<template>
  <div id="virtualDeskStream">
    <v-row no no-gutters>
      <v-col cols="12" class="minHeightStream">
        <JitsiStream
          :confLocalEmail="confLocalEmail"
          :confLocalName="confLocalName"
          :confRoomName="confRoomName"
          :confRoomTitle="confRoomTitle"
          :jwt="jwt"
          ref="streamComp"
        />
      </v-col>
      <v-col cols="12" class="py-0">
        <div class="text-center jitsiBtnControl">
          <v-container fluid class="py-sm-0">
            <v-row align="center" justify="center">
              <v-col cols="12" sm="1" class="clockBox">
                <p class="time">
                  <v-icon class="iconClock">mdi-clock</v-icon> {{ time }}
                </p>
              </v-col>
              <!-- FAQ BUTTON -->
              <!-- <v-col cols="12" sm="1" class="col-btn">
                <v-btn
                  class="mx-md-2"
                  @click="goFaq()"
                  fab
                  large
                  id="goFaq"
                  color="white"
                >
                  <v-icon>mdi-help</v-icon>
                </v-btn>
                <label
                  for="goFaq"
                  class="d-block"
                >
                  FAQ
                </label>
              </v-col> -->
              <v-spacer></v-spacer>
              <v-col cols="12" sm="auto" class="col-btn">
                <v-row justify="center">
                  <v-col cols="auto" class="mx-md-2">
                    <v-btn
                      class="mx-md-2"
                      @click="toggleVideo()"
                      fab
                      large
                      id="onOffVideo"
                      color="white"
                    >
                      <v-icon v-if="!audioVideo.video">mdi-video</v-icon>
                      <v-icon v-else>mdi-video-off</v-icon>
                    </v-btn>
                    <label
                      for="onOffVideo"
                      class="d-block"
                      v-if="!audioVideo.video"
                    >
                      Camera ON
                    </label>
                    <label for="onOffVideo" class="d-block" v-else>
                      Camera OFF
                    </label>
                  </v-col>
                  <v-col cols="auto" class="mx-md-2">
                    <v-btn
                      color="white"
                      class="mx-md-2"
                      @click="toggleAudio()"
                      fab
                      large
                      id="microphone"
                    >
                      <v-icon v-if="!audioVideo.audio">mdi-microphone</v-icon>
                      <v-icon v-else>mdi-microphone-off</v-icon>
                    </v-btn>
                    <label
                      for="microphone"
                      class="d-block"
                      v-if="!audioVideo.audio"
                    >
                      Microfono ON
                    </label>
                    <label for="microphone" class="d-block" v-else>
                      Microfono OFF
                    </label>
                  </v-col>
                  <v-col cols="auto" class="mx-md-2" v-if="isUser">
                    <v-btn
                      class="mx-md-2 btnHangup"
                      @click="hangup()"
                      fab
                      large
                      id="endCall"
                    >
                      <v-icon class="iconHangup">mdi-phone-hangup</v-icon>
                    </v-btn>
                    <label for="endCall" class="d-block">
                      Termina
                    </label>
                  </v-col>
                  <v-col cols="auto" class="mx-md-2" v-else>
                    <v-dialog v-model="dialog" max-width="290">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          class="mx-md-2 btnHangup"
                          fab
                          large
                          id="endCallOp"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon class="iconHangup">mdi-phone-hangup</v-icon>
                        </v-btn>
                        <label for="endCallOp" class="d-block">
                          Termina
                        </label>
                      </template>
                      <v-card>
                        <v-card-title class="headline"
                          >Confermi il termine dell'appuntamento?</v-card-title
                        >
                        <v-card-text>
                          <p>
                            Facendo click sul bottone
                            <strong>Termina</strong> si interromperà la
                            videoconferenza e non sarà più possibile parlare con
                            l'utente in questo appuntamento.
                          </p>
                          <strong>Si desidera procedere?</strong>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn text @click="dialog = false">ANNULLA</v-btn>
                          <v-btn text @click="hangup()">TERMINA</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-col>
                  <v-col cols="auto" class="mx-md-2">
                    <v-btn
                      class="mx-md-2"
                      @click="toggleChat()"
                      fab
                      large
                      color="white"
                      id="chat"
                    >
                      <v-icon>mdi-message-text</v-icon>
                    </v-btn>
                    <label for="chat" class="d-block">
                      Chat
                    </label>
                  </v-col>
                  <v-col cols="auto" class="mx-md-2">
                    <v-menu top :close-on-click="true" :offsetY="true">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          class="mx-md-2"
                          fab
                          large
                          color="white"
                          id="other"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-dots-horizontal</v-icon>
                        </v-btn>
                        <label for="chat" class="d-block">
                          Altre opzioni
                        </label>
                      </template>
                      <v-list
                        nav
                        dense
                        class="main-menu-left-offcanvas other-options"
                      >
                        <v-list-item-group
                          active-class="primary--text text--accent-4"
                        >
                          <v-list-item @click="uploadFileDrawer = true">
                            <v-img
                              max-width="20px"
                              class="mr-2"
                              :src="require('@/assets/images/icon/invia.svg')"
                              :lazy-src="
                                require('@/assets/images/icon/invia.svg')
                              "
                              alt="Invia o ricevi file"
                            />
                            <v-list-item-content>
                              <v-list-item-title
                                class="d-block font-weight-bold"
                                >Invia/ricevi file</v-list-item-title
                              >
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item @click="toggleShareScreen()">
                            <v-img
                              max-width="20px"
                              class="mr-2"
                              :src="
                                require('@/assets/images/icon/condividi_schermo.svg')
                              "
                              :lazy-src="
                                require('@/assets/images/icon/condividi_schermo.svg')
                              "
                              alt="Condividi lo schermo con l'utente / operatore"
                            />
                            <v-list-item-content>
                              <v-list-item-title
                                class="d-block font-weight-bold"
                                >Condividi schermo</v-list-item-title
                              >
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item @click="openModalPhoto()">
                            <v-img
                              max-width="20px"
                              class="mr-2"
                              :src="
                                require('@/assets/images/icon/istantanea.svg')
                              "
                              :lazy-src="
                                require('@/assets/images/icon/istantanea.svg')
                              "
                              alt="Upload di uno screenshoot"
                            />
                            <v-list-item-content>
                              <v-list-item-title
                                class="d-block font-weight-bold"
                                >Scatta una foto</v-list-item-title
                              >
                            </v-list-item-content>
                          </v-list-item>
                          <!-- prova registrazione -->
                          <!-- v-list-item @click="startRec()">
                            <v-list-item-content>
                              <v-list-item-title
                                class="d-block font-weight-bold"
                                >Inizia registrazione</v-list-item-title
                              >
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item @click="stopRec()">
                            <v-list-item-content>
                              <v-list-item-title
                                class="d-block font-weight-bold"
                                >Stop registrazione</v-list-item-title
                              >
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item @click="downloadRecordedVideo()">
                            <v-list-item-content>
                              <v-list-item-title
                                class="d-block font-weight-bold"
                                >Download registrazione</v-list-item-title
                              >
                            </v-list-item-content>
                          </v-list-item-->
                        </v-list-item-group>
                      </v-list>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="12" sm="auto" class="col-logo">
                <v-row justify="center" justify-sm="end">
                  <v-col>
                    <v-img
                      id="logoPartner"
                      class="mx-auto"
                      :src="require('@/assets/images/csi.png')"
                      alt="CSI Piemonte"
                      fluid
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-col>
    </v-row>
    <v-navigation-drawer
      v-model="uploadFileDrawer"
      fixed
      temporary
      id="uploadFilePopup"
      right
      width="300px"
    >
      <SendFiles :uploadByUser="isUser" />
    </v-navigation-drawer>
    <TakePicture
      ref="picture"
      v-bind:imgFile.sync="mForm.file"
      v-on:undofile="mForm.file = null"
      v-on:savefile="mForm.file = $event"
      v-on:loadpicture="uploadPicture()"
    />
    <Spinner :pOverlay="isLoading" />
    <!--video id="preview" autoplay></video--><!-- spostare in una API modale -->
  </div>
</template>

<script>
import SendFiles from "@/components/common/SendFiles";
import TakePicture from "@/components/common/snapshot/TakePicture";
import JitsiStream from "@/components/common/jitsi/JitsiStream";
import Spinner from "@/components/layout/Spinner";
import { ATTACHMENT_UPLOAD } from "@/store/actions.type";
import { mapGetters } from "vuex";
import { saveAs } from "file-saver";

export default {
  name: "VirtualDesk",
  props: {
    isUser: {
      type: Boolean,
      required: true
    },
    confLocalEmail: {
      type: String,
      required: false
    },
    confLocalName: {
      type: String,
      required: true
    },
    confRoomName: {
      // room jitsi
      type: String,
      required: true
    },
    confRoomTitle: {
      type: String,
      required: true
    },
    jwt: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters(["audioVideo", "appointment"])
  },
  components: { JitsiStream, SendFiles, Spinner, TakePicture },
  data() {
    return {
      dialog: false,
      isLoading: false,
      mForm: {
        file: null
      },
      modalPhotoFirstTime: true,
      recordedData: [],
      recorder: null,
      recordStream: null,
      uploadFileError: null,
      uploadFileDrawer: false,
      time: ""
    };
  },
  methods: {
    startStream() {
      this.$refs.streamComp.startStream();
    },
    hangup() {
      this.dialog = false;
      this.$refs.streamComp.hangup();
      this.$emit("hangup");
    },
    toggleChat() {
      this.$refs.streamComp.toggleChat();
    },
    toggleVideo() {
      this.$refs.streamComp.toggleVideo();
    },
    toggleAudio() {
      this.$refs.streamComp.toggleAudio();
    },
    toggleShareScreen() {
      this.$refs.streamComp.toggleShareScreen();
    },
    updateTime() {
      const cd = new Date();
      this.time =
        this.zeroPadding(cd.getHours(), 2) +
        ":" +
        this.zeroPadding(cd.getMinutes(), 2);
    },
    openModalPhoto() {
      this.$refs.picture.modalPhoto = true;
      if (!this.modalPhotoFirstTime) this.$refs.picture.playVideo();
      this.modalPhotoFirstTime = false;
    },
    downloadRecordedVideo() {
      const rd = this.recordedData;
      console.log("rd: ", { rd });
      const recordedBlob = new Blob(rd, {
        type: "video/webm"
      });
      saveAs(recordedBlob, "RecordedVideo.webm");
    },
    stopRec() {
      if (this.recorder.state == "recording") this.recorder.stop();
      this.recordStream.getTracks().forEach(track => track.stop());
    },
    async startRec(stream) {
      const jitsiIframe = document.getElementById("jitsiConferenceFrame0");
      let largeVideo = jitsiIframe.contentWindow.document.getElementById(
        "largeVideo"
      );

      const style = largeVideo.getAttribute("style");
      console.log("style: " + style);
      // preview.srcObject = stream;
      largeVideo.captureStream =
        largeVideo.captureStream || largeVideo.mozCaptureStream;
      // preview.play();

      this.recordStream = largeVideo.captureStream();
      const rs = this.recordStream;
      console.log("recordStream: ", { rs });

      this.recorder = new MediaRecorder(this.recordStream);
      this.recorder.ondataavailable = event =>
        this.recordedData.push(event.data);
      this.recorder.start();
    },
    uploadPicture() {
      const upFile = this.mForm.file;
      this.uploadFileError = null;
      this.detailError = { message: "", title: "" };
      if (upFile == null) return;

      var formData = new FormData();
      formData.append("slug", this.appointment.appointment_id);
      formData.append("upFile", upFile);
      formData.append("fileName", upFile.name);
      formData.append("uploadByUser", this.isUser);

      this.isLoading = true;
      this.$store
        .dispatch(ATTACHMENT_UPLOAD, formData)
        .then(() => {
          const VueThis = this;
          setTimeout(() => {
            VueThis.isLoading = false;
            VueThis.mForm.file = null;
            VueThis.uploadFileDrawer = true; // apertura tab file inviati
          }, 5000);
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
    zeroPadding(num, digit) {
      let zero = "";
      for (var i = 0; i < digit; i++) {
        zero += "0";
      }
      return (zero + num).slice(-digit);
    }
  },
  mounted() {
    const timerID = setInterval(this.updateTime, 60 * 1000);
    this.updateTime();
    this.startStream();
  }
};
</script>
