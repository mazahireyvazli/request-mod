import {
  createBrowserRouter,
  createHashRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";

import { CreateRulePage } from "./pages/CreateRulePage";
import { HomePage } from "./pages/HomePage";
import { RulePage } from "./pages/RulePage";
import { isExtension, storageLastPageKey } from "./utils/common";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/rules/:id",
    element: <RulePage />,
  },
  {
    path: "/rules/create",
    element: <CreateRulePage />,
  },
];

const router = !isExtension()
  ? createBrowserRouter(routes)
  : createHashRouter(routes);

router.subscribe((state) => {
  localStorage.setItem(storageLastPageKey, state.location.pathname);
});

export const App = () => {
  return <RouterProvider router={router} />;
};
