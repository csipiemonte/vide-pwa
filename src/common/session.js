import { APPSCHED_LOGIN_URL } from "@/common/config";
import store from "@/store";
import { OPERATOR_LOGOUT } from "@/store/actions.type";

export const login = () => {
  window.location = APPSCHED_LOGIN_URL;
};

export const logout = () => {
  store.dispatch(OPERATOR_LOGOUT).then(() => {
    window.location = APPSCHED_LOGIN_URL;
  });
};
