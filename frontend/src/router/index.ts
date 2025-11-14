import { createRouter, createWebHistory } from "vue-router";
import LoginForm from "../components/LoginForm.vue";
import UsersPage from "../pages/UsersPage.vue";
import ResetPassword from "../components/ResetPassword.vue";
import { useAuthStore } from "../stores/auth";

const routes = [
  {
    path: "/login-meu-pet",
    name: "Login",
    component: LoginForm,
  },
  {
    path: "/users",
    name: "Users",
    component: UsersPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPassword,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.user) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
