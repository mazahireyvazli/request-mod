import {
  createBrowserRouter,
  createHashRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";

import clsx from "clsx";
import { SigninModal } from "./components/SigninModal";
import { CreateRulePage } from "./pages/CreateRulePage";
import { EnvironmentDetailPage } from "./pages/EnvironmentDetailPage";
import { EnvironmentsPage } from "./pages/Environments";
import { HomePage } from "./pages/HomePage";
import { RulePage } from "./pages/RulePage";
import { appContext, appStateHandler } from "./utils/app-context";
import { isExtension, storageLastPageKey } from "./utils/common";
import { useEffect } from "react";

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
    path: "/environments",
    element: <EnvironmentsPage />,
  },
  {
    path: "/environments/:id",
    element: <EnvironmentDetailPage />,
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
  const appState = appStateHandler();

  const isAuthenticated = !!appState.currentUser?.document_id;

  useEffect(() => {
    const lastPage = localStorage.getItem(storageLastPageKey);

    if (isAuthenticated && lastPage) {
      router.navigate(lastPage);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isExtension()) {
      document.body.classList.add("extension-wrapper");
    }
  }, []);

  return (
    <appContext.Provider value={appState}>
      {isAuthenticated && <RouterProvider router={router} />}
      {!isAuthenticated && (
        <SigninModal show={true} loading={!appState.authStateSettled} />
      )}
    </appContext.Provider>
  );
};
