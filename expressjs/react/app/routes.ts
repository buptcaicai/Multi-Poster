import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
   index("routes/index.tsx"),
   layout("components/MainLayout.tsx", [
      route("posts", "routes/posts.tsx")
   ]),
   route("/login", "routes/login.tsx"),
   ...prefix("/admin", [
      layout("admin/AdminLayout.tsx", [
         index("admin/UserList.tsx"),
      ]),
   ]),
] satisfies RouteConfig;
