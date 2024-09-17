import {
  createBrowserRouter,
  createHashRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";

import { SigninModal } from "./components/SigninModal";
import { CreateRulePage } from "./pages/CreateRulePage";
import { EnvironmentDetailPage } from "./pages/EnvironmentDetailPage";
import { EnvironmentsPage } from "./pages/Environments";
import { HomePage } from "./pages/HomePage";
import { RulePage } from "./pages/RulePage";
import { AppContext, useAppStateHandler } from "./utils/app-context";
import { isExtension, storageLastPageKey } from "./utils/common";
import { useEffect } from "react";
import { NotFoundPage } from "./pages/NotFoundPage";
import { Spinner } from "flowbite-react";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/rules/create",
    element: <CreateRulePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/environments",
    element: <EnvironmentsPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/environments/:id",
    element: <EnvironmentDetailPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/rules/:id",
    element: <RulePage />,
    errorElement: <NotFoundPage />,
  },
];

const router = !isExtension()
  ? createBrowserRouter(routes)
  : createHashRouter(routes);

router.subscribe((state) => {
  localStorage.setItem(storageLastPageKey, state.location.pathname);
});

export const App = () => {
  const appState = useAppStateHandler();

  const isAuthenticated = !!appState.currentUser?.document_id;
  const isExtensionOpenInPopup = appState.isExtensionOpenInPopup;

  useEffect(() => {
    const lastPage = localStorage.getItem(storageLastPageKey);

    if (isAuthenticated && lastPage) {
      router.navigate(lastPage);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isExtensionOpenInPopup) {
      document.body.classList.add("extension-wrapper");
    }
  }, [isExtensionOpenInPopup]);

  if (!appState.authStateSettled) {
    return (
      <div className="flex justify-center items-center w-dvh h-dvh">
        <Spinner color="purple" aria-label="Purple spinner example" size="xl" />
      </div>
    );
  }

  return (
    <AppContext.Provider value={appState}>
      {isAuthenticated && <RouterProvider router={router} />}
      {!isAuthenticated && <SigninModal show={true} />}
    </AppContext.Provider>
  );
};
