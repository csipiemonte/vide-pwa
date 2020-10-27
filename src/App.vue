<template>
  <v-app id="app">
    <main
      id="main-app"
      :class="
        $route.name !== 'operator-appointment' &&
        $route.name !== 'user-appointment' &&
        $route.name !== 'user-start-appointment'
          ? 'totalApp'
          : 'hidefooter'
      "
    >
      <CsiAppBootstrap>
        <router-view></router-view>
      </CsiAppBootstrap>
    </main>
    <Footer />
  </v-app>
</template>

<script>
import CsiAppBootstrap from "@/components/common/CsiAppBootstrap";
import Footer from "@/components/layout/Footer";

export default {
  name: "App",
  components: { CsiAppBootstrap, Footer }
};
</script>

<style></style>
