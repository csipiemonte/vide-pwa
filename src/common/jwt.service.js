import Vue from "vue";
import VueCookies from "vue-cookies";
import { VIDE_AUTH_COOKIE } from "@/common/config";

Vue.use(VueCookies);

export const getVideAuthCookie = () => {
  if (!Vue.$cookies.isKey(VIDE_AUTH_COOKIE)) return null;
  return Vue.$cookies.get(VIDE_AUTH_COOKIE);
};

export const destroyVideAuthCookie = () => {
  Vue.$cookies.remove(VIDE_AUTH_COOKIE);
};

export default {
  destroyVideAuthCookie,
  getVideAuthCookie
};
