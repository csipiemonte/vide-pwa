import { OperatorService } from "@/common/api.service";
import JwtService from "@/common/jwt.service";

import { OPERATOR_LOGOUT, OPERATOR_CHECK_AUTH } from "./actions.type";
import { SET_OPERATOR_AUTH, PURGE_OPERATOR_AUTH } from "./mutations.type";

const state = {
  operator: {},
  ifAdminAuthenticated: false,
  ifOperatorAuthenticated: false
};

const getters = {
  currentOperator(state) {
    return state.operator;
  },
  ifOperatorAuthenticated(state) {
    return state.ifOperatorAuthenticated;
  }
};

const actions = {
  async [OPERATOR_CHECK_AUTH](context) {
    const appschedJwt = JwtService.getVideAuthCookie();
    if (appschedJwt == null) {
      context.commit(PURGE_OPERATOR_AUTH);
      return;
    }
    return await OperatorService.decodeToken(appschedJwt).then(
      response => {
        context.commit(SET_OPERATOR_AUTH, response.data);
        return Promise.resolve(response);
      },
      error => {
        context.commit(PURGE_OPERATOR_AUTH);
        return Promise.reject(error);
      }
    );
  },
  [OPERATOR_LOGOUT](context) {
    const appschedJwt = JwtService.getVideAuthCookie();
    if (appschedJwt != null) {
      JwtService.destroyVideAuthCookie();
    }
    context.commit(PURGE_OPERATOR_AUTH);
  }
};

const mutations = {
  [SET_OPERATOR_AUTH](state, data) {
    state.ifOperatorAuthenticated = true;
    state.operator = data.operator;
  },
  [PURGE_OPERATOR_AUTH](state) {
    state.ifOperatorAuthenticated = false;
    state.operator = {};
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
