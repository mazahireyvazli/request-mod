import {
  createBrowserRouter,
  createMemoryRouter,
  RouterProvider,
} from "react-router-dom";

import { CreateRulePage } from "./pages/CreateRulePage";
import { HomePage } from "./pages/HomePage";
import { RulePage } from "./pages/RulePage";
import { isExtension } from "./utils/common";

const routes = [
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
  : createMemoryRouter(routes);

export const App = () => {
  return <RouterProvider router={router} />;
};
