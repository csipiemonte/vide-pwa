import Vue from "vue";
import VueRouter from "vue-router";
import { APP } from "./global";
import * as ERROR_ROUTES from "./errors";

Vue.use(VueRouter);

const routes = [
  APP,
  {
    path: "/operator",
    component: () => import("@/views/operator/OperatorHome"),
    children: [
      {
        name: "appointment-detail",
        path: "appointment/detail/:slug",
        component: () => import("@/views/operator/AppointmentDetail"),
        props: true
      },
      {
        name: "operator-appointment",
        path: "appointment/stream/:slug",
        component: () => import("@/views/operator/OperatorViDe"),
        props: true
      }
    ]
  },
  {
    path: "/user",
    component: () => import("@/views/user/UserHome"),
    meta: { isPublic: true },
    children: [
      {
        name: "user-join-appointment",
        path: "join/:slug",
        component: () => import("@/views/user/JoinViDe"),
        meta: { isPublic: true }
      },
      {
        name: "user-login-appointment",
        path: "login",
        component: () => import("@/views/user/JoinViDe"),
        meta: { isPublic: true }
      },
      {
        name: "user-start-appointment",
        path: "start/:slug",
        component: () => import("@/views/user/StartViDe"),
        meta: { isPublic: true },
        props: true
      },
      {
        name: "user-appointment",
        path: "appointment/stream/:slug",
        component: () => import("@/views/user/UserViDe"),
        meta: { isPublic: true },
        props: true
      },
      {
        name: "user-stop-appointment",
        path: "stop",
        component: () => import("@/views/user/StopViDe"),
        meta: { isPublic: true }
      }
    ]
  }
];

routes.push(ERROR_ROUTES.ERROR_500);
routes.push(ERROR_ROUTES.ERROR_404);

const Router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      };
    }
    return { x: 0, y: 0 };
  }
});

export default Router;
