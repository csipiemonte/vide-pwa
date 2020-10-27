import VideFilter from "@/filters/vide.filter";

/**
 * @description
 * In questo file andiamo ad aggiungere filtri custom al progetto
 */
export default {
  install(Vue) {
    Vue.filter("translateStatus", VideFilter.translateStatus);
  }
};
