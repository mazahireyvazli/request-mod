import {
  createBrowserRouter,
  createHashRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";

import { SigninModal } from "./components/SigninModal";
import { AppContext, useAppStateHandler } from "./utils/app-context";
import { isExtension, storageLastPageKey } from "./utils/common";
import { lazy, Suspense, useEffect } from "react";
import { Spinner } from "flowbite-react";

const HomePage = lazy(() =>
  import("./pages/HomePage").then((m) => ({ default: m.HomePage })),
);
const CreateRulePage = lazy(() =>
  import("./pages/CreateRulePage").then((m) => ({ default: m.CreateRulePage })),
);
const EnvironmentDetailPage = lazy(() =>
  import("./pages/EnvironmentDetailPage").then((m) => ({
    default: m.EnvironmentDetailPage,
  })),
);
const EnvironmentsPage = lazy(() =>
  import("./pages/Environments").then((m) => ({ default: m.EnvironmentsPage })),
);
const RulePage = lazy(() =>
  import("./pages/RulePage").then((m) => ({ default: m.RulePage })),
);
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);

const PageLoader = () => {
  return (
    <div className="flex justify-center items-center w-dvh h-dvh">
      <Spinner color="purple" aria-label="Purple spinner example" size="xl" />
    </div>
  );
};

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
    return <PageLoader />;
  }

  return (
    <AppContext.Provider value={appState}>
      {isAuthenticated && (
        <Suspense fallback={<PageLoader />}>
          <RouterProvider router={router} />
        </Suspense>
      )}
      {!isAuthenticated && <SigninModal show={true} />}
    </AppContext.Provider>
  );
};
