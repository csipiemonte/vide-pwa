import Vue from "vue";
import { GlobalService } from "@/common/api.service";
import { getHostname } from "@/common/utils";

import {
  FETCH_CLIENT_IP,
  FETCH_TENANT_CAROUSEL,
  FETCH_TENANT_LAYOUT,
  FETCH_TENANT_ID
} from "./actions.type";

import {
  RESET_STATE,
  SET_CLIENT_IP,
  SET_TENANT_ID,
  SET_TENANT_LAYOUT
} from "./mutations.type";

const initialState = {
  clientIp: undefined,
  tenantLayout: { tenantColor: "#0072E5" },
  tenantId: undefined
};

export const state = { ...initialState };

export const actions = {
  async [FETCH_CLIENT_IP](context) {
    const { data } = await GlobalService.clientIp();
    context.commit(SET_CLIENT_IP, data.ip);
    return { data };
  },
  async [FETCH_TENANT_CAROUSEL]() {
    const { data } = await GlobalService.carousel();
    return { data };
  },
  async [FETCH_TENANT_ID](context) {
    const { data } = await GlobalService.tenant(getHostname());
    context.commit(SET_TENANT_ID, data.tenantId);
    return data.tenantId;
  },
  async [FETCH_TENANT_LAYOUT](context) {
    return await GlobalService.layout().then(
      response => {
        const data = {
          tenantLogo: response.data.logo, // il campo "logo" deve contenere il prefisso "data:image/png;base64," (per le immagini png, vanno bene anche gif e jpeg -> prefisso con gif/jpeg)
          tenantColor: "#0072E5" // TODO da rimuovere una volta tolto il commento al codice sottostante
        };

        // TODO rimuovere il commento quando lato appschedweb sara' gestita la scelta di colori
        // if (response.data.color != undefined)
        // data.tenantColor = response.data.color;
        context.commit(SET_TENANT_LAYOUT, data);
        return { data };
      },
      error => {
        return null;
      }
    );
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [SET_CLIENT_IP](state, clientIp) {
    state.clientIp = clientIp;
  },
  [SET_TENANT_ID](state, tenantId) {
    state.tenantId = tenantId;
  },
  [SET_TENANT_LAYOUT](state, tenantLayout) {
    state.tenantLayout = tenantLayout;
  },
  [RESET_STATE]() {
    for (let f in state) {
      Vue.set(state, f, initialState[f]);
    }
  }
};

const getters = {
  clientIp(state) {
    return state.clientIp;
  },
  tenantId(state) {
    return state.tenantId;
  },
  tenantLayout(state) {
    return state.tenantLayout;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
