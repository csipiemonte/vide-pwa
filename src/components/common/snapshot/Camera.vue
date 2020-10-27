<template>
  <div class="streamCamera">
    <div class="row">
      <div class="col-md-6">
        <video
          ref="video"
          class="streamCamera"
          width="640"
          height="480"
          autoplay
        >
          Video stream non disponibile.
        </video>
      </div>
      <div class="col-md-6">
        <canvas id="canvas" ref="canvas" class="canvasCamera" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Camera",
  props: {
    video: { type: Boolean, required: false, default: true },
    audio: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      stream: undefined
    };
  },
  methods: {
    async playVideo() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment"
          },
          audio: this.audio
        });

        this.$refs.video.srcObject = this.stream;
        this.$refs.video.play();
      } catch (error) {
        // cfr. https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        this.$emit("updateboxerr", {
          title: this.$i18n.t("general.error"),
          message:
            "Problemi occorsi durante l'attivazione della fotocamera. " +
            'Per poter utilizzare la funzionalità "Scatta una foto" è necessario permettere l\'accesso alla fotocamera.'
        });
      }
    },

    takeAPhoto() {
      const video = this.$refs.video;
      const canvas = this.$refs.canvas;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      return canvas;
    },

    clearPhoto() {
      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/png");
    }
  },

  async mounted() {
    this.playVideo();
  },

  async beforeDestroy() {
    try {
      this.$refs.video.pause();
      const tracks = this.stream.getTracks();
      tracks.forEach(track => track.stop());
    } catch (error) {
      console.log(error);
    }
  }
};
</script>
