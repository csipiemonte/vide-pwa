<template>
  <div>
    <slot v-if="!isLoading" />
    <div class="app-container">
      <Spinner :pOverlay="isLoading" />
    </div>
  </div>
</template>

<script>
import { APPSCHED_LOGIN_URL } from "@/common/config";
import { login } from "@/common/session";
import { isEmptyHash, isNil } from "@/common/utils";
import Spinner from "@/components/layout/Spinner";
import { APP } from "@/router/global";
import { ERROR_BOOTSTRAP } from "@/router/errors";
import { canAccessRoute, ensureLogin } from "@/router/hooks";
import store from "@/store";
import {
  FETCH_CLIENT_IP,
  FETCH_TENANT_LAYOUT,
  FETCH_TENANT_ID,
  OPERATOR_CHECK_AUTH
} from "@/store/actions.type";
import { mapGetters } from "vuex";

export default {
  name: "CsiAppBootstrap",
  data() {
    return {
      isLoading: true
    };
  },
  components: { Spinner },
  computed: {
    ...mapGetters(["tenantLayout"]),
    fromDateDisp() {
      return moment.utc(this.searchDate).format("DD/MM/YYYY");
    }
  },
  async created() {
    // ATTENZIONE alla sequenza delle store.dispatch
    const services = await store.dispatch(FETCH_CLIENT_IP);
    console.log("services", services);
    if (isNil(services)) {
      this.$router.push(ERROR_BOOTSTRAP);
      this.isLoading = false;
      return;
    }

    const tenantId = await store.dispatch(FETCH_TENANT_ID);
    if (isNil(tenantId)) {
      this.$router.push(ERROR_BOOTSTRAP);
      this.isLoading = false;
      return;
    }

    await store.dispatch(FETCH_TENANT_LAYOUT);
    const primaryColor = this.tenantLayout.tenantColor;
    console.log("primaryColor: " + primaryColor);
    document.documentElement.style.setProperty("--primary-color", primaryColor);

    const userPromise = await store.dispatch(OPERATOR_CHECK_AUTH);
    const user = await userPromise;
    console.log("user", { user });

    this.$router.beforeEach(ensureLogin);

    // aspettiamo che il router sia pronto prima di ottenere la route dall'URL
    this.$router.onReady(() => {
      console.debug("[FirstAccess] Router ready");
      console.debug("[FirstAccess] Router:", this.$router);
      console.debug("[FirstAccess] Route:", this.$route);
      console.debug(
        "[FirstAccess] matched:",
        this.$router.getMatchedComponents()
      );
      console.debug("[FirstAccess] current:", this.$router.history.current);

      const canAccess = canAccessRoute(this.$route);
      if (!canAccess) {
        if (!store.getters.ifOperatorAuthenticated) {
          console.debug(
            "[FirstAccess] The route is not public and the operator is not logged => redirect to login..."
          );
          login();
        } else {
          console.debug(
            "[FirstAccess] The route is not public and the user is logged => redirect to home..."
          );
          this.$router.push(APP);
        }
      }

      this.isLoading = false;
    });

    // Evitiamo di spaccare completamente l'app
    // In questo modo è sempre possibile aggiornarla
    setTimeout(() => {
      this.isLoading = false;
    }, 5000);
  }
};
</script>
