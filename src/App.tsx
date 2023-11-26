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
import { RuleSetContext, ruleSetStateHandler } from "./utils/ruleset-context";
import { RuleSet } from "./models/rule";

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
  return (
    <RuleSetContext.Provider value={ruleSetStateHandler(RuleSet.getInstance())}>
      <RouterProvider router={router} />
    </RuleSetContext.Provider>
  );
};
