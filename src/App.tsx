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
import { appContext, appStateHandler } from "./utils/app-context";
import { VariablesPage } from "./pages/Variables";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/rules/create",
    element: <CreateRulePage />,
  },
  {
    path: "/rules/variables",
    element: <VariablesPage />,
  },
  {
    path: "/rules/:id",
    element: <RulePage />,
  },
];

const router = !isExtension()
  ? createBrowserRouter(routes)
  : createHashRouter(routes);

router.subscribe((state) => {
  localStorage.setItem(storageLastPageKey, state.location.pathname);
});

export const App = () => {
  return (
    <appContext.Provider value={appStateHandler()}>
      <RouterProvider router={router} />
    </appContext.Provider>
  );
};
