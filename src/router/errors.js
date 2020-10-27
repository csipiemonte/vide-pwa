export const ERROR_BOOTSTRAP = {
  path: "/errors/bootstrap",
  name: "errorBootstrap",
  component: () => import("@/views/error/Bootstrap"),
  meta: { isPublic: true }
};

export const ERROR_500 = {
  path: "/errors/500",
  name: "error500",
  component: () => import("@/views/error/500InternalServer"),
  meta: { isPublic: true }
};

export const ERROR_404 = {
  name: "error404",
  path: "*",
  component: () => import("@/views/error/404NotFound"),
  meta: { isPublic: true }
};
