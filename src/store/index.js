import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth.module";
import home from "./home.module";
import appointment from "./appointment.module";
import global from "./global.module";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    home,
    auth,
    appointment,
    global
  }
});
