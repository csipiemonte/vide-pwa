<template>
  <div>
    <div id="stream-container"></div>
    <!-- <p>{{ api }}</p> -->

    <!-- <p>{{ optionsObj }}</p> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "JitsiStream",
  props: {
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
  data() {
    return {
      api: null,
      optionsObj: {}
    };
  },
  computed: {
    ...mapGetters(["audioVideo"])
  },
  methods: {
    hangup() {
      this.api.executeCommand("hangup");
      // You can remove the embedded Jitsi Meet Conference with the following API function:
      // NOTE: It's a good practice to remove the conference before the page is unloaded.
      this.api.dispose();
    },
    startStream() {
      const container = document.querySelector("#stream-container");
      const options = {
        roomName: this.confRoomName,
        parentNode: container,
        jwt: this.jwt,
        interfaceConfigOverwrite: {
          DISABLE_FOCUS_INDICATOR: true,
          DEFAULT_LOCAL_DISPLAY_NAME: this.confLocalName,
          DEFAULT_LOGO_URL: "",
          JITSI_WATERMARK_LINK: "",
          MOBILE_APP_PROMO: false,
          RECENT_LIST_ENABLED: false,
          SETTINGS_SECTIONS: ["devices", "profile"],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          // cfr https://github.com/jitsi/jitsi-meet/blob/master/interface_config.js
          // Rimossi da conf originaria: "sharedvideo" (Condividi un video Youtube),
          // "recording" (Inizia a registrare), "livestreaming" (Inizia una diretta),
          // "videobackgroundblur" (Offusca il video), "mute-everyone", "stats" (Statistiche)
          // "shortcuts" (Scorciatoie), "raisehand", (alza la mano),  "fullscreen" (schermo intero)
          // "settings" (Impostazioni), "videoquality" (Gestione qualita video)
          // "e2ee" (end to end encryption), "profile" (profilo), "desktop" (condivisione schermo)
          TOOLBAR_BUTTONS: ["chat", "desktop", "settings", "videoquality"],
          filmStripOnly: false // se mostrare solamente il filmstrip (e nascondere la toolbar).
          // A html text to be shown to guests on the close page, false disables it
        },
        userInfo: {
          displayName: this.confLocalName
        }
      };
      if (this.confLocalEmail != null && this.confLocalEmail != undefined)
        options.userInfo.email = this.confLocalEmail;

      this.api = new JitsiMeetExternalAPI(
        process.env.VUE_APP_CONFERENCE_URL_DOMAIN,
        options
      );
      this.api.addListener("videoMuteStatusChanged", object => {
        this.audioVideo.video = object.muted;
      });

      this.api.addListener("audioMuteStatusChanged", object => {
        this.audioVideo.audio = object.muted;
      });

      this.api.executeCommand("subject", this.confRoomTitle);

      this.optionsObj = { ...options };
    },
    toggleChat() {
      this.api.executeCommand("toggleChat");
    },
    toggleVideo() {
      this.api.executeCommand("toggleVideo");
    },
    toggleAudio() {
      this.api.executeCommand("toggleAudio");
    },
    toggleShareScreen() {
      this.api.executeCommand("toggleShareScreen");
    }
  }
};
</script>
