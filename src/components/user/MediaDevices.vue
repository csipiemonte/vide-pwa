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
  name: "MediaDevices",
  props: {
    video: { type: Boolean, required: false, default: true },
    audio: { type: Boolean, required: false, default: true }
  },
  data() {
    return {
      stream: undefined
    };
  },
  methods: {
    async playAudioVideo() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment"
          },
          audio: this.audio
        });

        this.$refs.video.srcObject = this.stream;
        this.$refs.video.play();
        this.$emit("updateboxsucc", {
          title: "Tutto OK!",
          message:
            "Fotocamera e microfono correttamente attivati. Puoi fare click su CHIUDI e attendere che il bottone INIZIA LA VIDEOCHIAMATA diventi blu."
        });
      } catch (error) {
        // cfr. https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        this.$emit("updateboxerr", {
          title: "Errore",
          message:
            "Problemi occorsi durante l'attivazione della fotocamera e del microfono. " +
            "Per poter utilizzare il servizio di videoconferenza è necessario permettere l'accesso alla fotocamera e al microfono: per rimuovere il blocco cliccare sulle icone di videocamera e microfono poste prima dell'indirizzo del sito, ricaricare la pagina, ripetere la prova di attivazione e in ultimo fare click su Consenti quando richiesto dalla pagina."
        });
      }
    }
  },

  async mounted() {
    this.playAudioVideo();
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
