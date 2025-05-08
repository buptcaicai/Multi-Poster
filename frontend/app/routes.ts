import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
   index("routes/index.tsx"),
   layout("components/MainLayout.tsx", [
      route("posts", "routes/posts.tsx")
   ]),
   route("/login", "routes/login.tsx")
] satisfies RouteConfig;
