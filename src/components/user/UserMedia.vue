<template>
  <v-card class="pa-4 col-12 col-sm-10 col-md-8 mx-auto my-12 controlMedia">
    <v-container>
      <v-row justify="space-between" class="mb-0 mb-sm-6 mb-md-12">
        <v-col cols="11" orde>
          <SuccessBox
            :success="detailSuccess"
            type="successConfig"
            class="successAlert"
          />
        </v-col>
        <v-col cols="1" class="text-right">
          <v-icon @click.stop="closeDialog()" class="close-dialog iconClose"
            >mdi-close</v-icon
          >
        </v-col>
      </v-row>
      <ErrorBox :error="detailError" type="errorConfig" />
      <div class="d-block text-center">
        <MediaDevices
          ref="mediaDevices"
          v-on:updateboxsucc="updateDetailSuccess($event)"
          v-on:updateboxerr="updateDetailError($event)"
        />
      </div>
      <v-card-actions class="closeBtn">
        <v-row justify="end">
          <v-btn
            depressed
            class="mt-3 mr-3 close-dialog"
            color="primary"
            @click="closeDialog()"
          >
            Chiudi
          </v-btn>
        </v-row>
      </v-card-actions>
    </v-container>
  </v-card>
</template>

<script>
import ErrorBox from "@/components/layout/ErrorBox";
import SuccessBox from "@/components/layout/SuccessBox";
import MediaDevices from "@/components/user/MediaDevices";

export default {
  name: "UserMedia",
  components: { MediaDevices, ErrorBox, SuccessBox },
  data() {
    return {
      detailError: { message: "", title: "" },
      detailSuccess: { message: "", title: "" }
    };
  },
  methods: {
    playAudioVideo() {
      this.$refs.mediaDevices.playAudioVideo();
    },
    updateDetailError(detErr) {
      this.detailError = detErr;
      this.detailSuccess = { message: "", title: "" };
    },
    updateDetailSuccess(detSuc) {
      this.detailSuccess = detSuc;
      this.detailError = { message: "", title: "" };
    },
    closeDialog() {
      this.$refs.mediaDevices.$refs.video.pause();
      if (this.$refs.mediaDevices.stream != undefined) {
        const tracks = this.$refs.mediaDevices.stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      this.$emit("closecard");
    }
  }
};
</script>
