<template>
  <v-dialog
    v-model="modalPhoto"
    ref="modaleFoto"
    hide-footer
    title="Scatta una foto"
    @click:outside="closeDialog()"
    max-width="600px"
  >
    <v-card class="pa-4">
      <v-container>
        <v-row justify="end">
          <v-icon @click.stop="closeDialog()">mdi-close</v-icon>
        </v-row>

        <ErrorBox :error="detailError" />
        <div class="d-block text-center">
          <Camera ref="camera" v-on:updateboxerr="updateDetailError($event)" />
          <v-btn
            depressed
            @click="shootPhoto()"
            color="primary"
            v-if="
              this.detailError.message === '' && this.detailError.title === ''
            "
          >
            <v-icon class="mr-2">mdi-camera</v-icon>Scatta
          </v-btn>
        </div>
        <v-card-actions>
          <v-row justify="end">
            <v-btn
              depressed
              v-if="imgFile !== null"
              class="mt-3 mr-3"
              outlined
              color="primary"
              @click="hideModalPhoto()"
            >
              <strong>Annulla</strong>
            </v-btn>
            <v-btn
              depressed
              v-if="imgFile !== null"
              class="mt-3"
              color="primary"
              @click="loadPhoto()"
            >
              Invia
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import ErrorBox from "@/components/layout/ErrorBox";
import Camera from "@/components/common/snapshot/Camera";

export default {
  name: "TakePicture",
  props: {
    imgFile: { type: File, required: false }
  },
  components: { Camera, ErrorBox },
  data() {
    return {
      detailError: { message: "", title: "" },
      modalPhoto: false
    };
  },
  methods: {
    playVideo() {
      this.$refs.camera.playVideo();
    },
    hideModalPhoto() {
      this.$refs.camera.clearPhoto();
      this.$refs.camera.$refs.video.pause();
      if (this.$refs.camera.stream != undefined) {
        const tracks = this.$refs.camera.stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      this.modalPhoto = false;
      this.$emit("undofile");
    },

    shootPhoto() {
      const data = new Date();
      let mese = (data.getMonth() + 1).toString();
      if (mese.length === 1) mese = "0" + mese;
      const nomeFile =
        "IMG" +
        data.getFullYear().toString() +
        mese +
        data.getDate().toString() +
        data.getHours().toString() +
        data.getMinutes().toString() +
        data.getSeconds().toString();

      var self = this;
      const canvas = this.$refs.camera.takeAPhoto();
      canvas.toBlob(
        function(blob) {
          const file = new File([blob], nomeFile + ".jpg", {
            type: "image/jpeg"
          });
          self.$emit("savefile", file);
        },
        "image/jpeg",
        0.95
      ); // JPEG at 95% quality
    },

    loadPhoto() {
      this.modalPhoto = false;
      this.$emit("loadpicture");
      this.$refs.camera.$refs.video.pause();
      const tracks = this.$refs.camera.stream.getTracks();
      tracks.forEach(track => track.stop());
    },

    updateDetailError(detErr) {
      this.detailError = detErr;
    },
    closeDialog() {
      this.$refs.camera.clearPhoto();
      this.$refs.camera.$refs.video.pause();
      if (this.$refs.camera.stream != undefined) {
        const tracks = this.$refs.camera.stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      this.modalPhoto = false;
      return this.modalPhoto;
    }
  }
};
</script>
