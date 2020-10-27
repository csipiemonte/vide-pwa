import Vue from "vue";
import Vuetify from "vuetify";
import App from "./App.vue";
import filters from "./plugins/filters";
import router from "./router";
import store from "./store";

import "./registerServiceWorker";

import it from "vuetify/es5/locale/it";
import "./assets/stylesheets/application.scss";

Vue.config.productionTip = false;

Vue.use(filters);
Vue.use(Vuetify);

const vuetifyOptions = {
  lang: {
    locales: { it },
    current: "it"
  }
};

new Vue({
  router,
  store,
  render: h => h(App),
  vuetify: new Vuetify(vuetifyOptions)
}).$mount("#app");
