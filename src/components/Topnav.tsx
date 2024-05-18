import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../utils/app-context";
import { DocumentID } from "../types/firestore";
import { Nullable } from "../types/nullable";
import { Tooltip } from "flowbite-react";

export const Topnav = () => {
  const {
    environments,
    setActiveEnvironment,
    currentUser,
    isExtensionOpenInPopup,
  } = useContext(AppContext);

  const handleActiveEnvironmentChange = (env_id: Nullable<DocumentID>) => {
    setActiveEnvironment(env_id);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              data-drawer-target="default-sidenav"
              data-drawer-toggle="default-sidenav"
              aria-controls="default-sidenav"
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open sidenav</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                />
              </svg>
            </button>
            <Link to="/" className="flex items-center ms-2 md:me-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fillRule="evenodd"
                strokeLinejoin="round"
                strokeMiterlimit={2}
                clipRule="evenodd"
                viewBox="0 0 144 144"
                width={26}
                height={26}
                className="fill-sky-600"
              >
                <path d="M120.404 65.851c15.065-15.064 15.065-39.488 0-54.553-15.054-15.054-39.498-15.054-54.553 0-15.064 15.065-15.064 39.489 0 54.553l20.458-20.457a9.644 9.644 0 1 1 13.638 0l20.457 20.457Z" />
                <path d="M65.851 120.404c15.065 15.065 39.489 15.065 54.553 0 15.055-15.054 15.055-39.498 0-54.553-15.064-15.064-39.488-15.064-54.553 0l20.458 20.458a9.644 9.644 0 1 1 0 13.638l-20.458 20.457Z" />
                <path d="M11.298 65.851c-15.064 15.065-15.064 39.489 0 54.553 15.055 15.055 39.499 15.055 54.553 0 15.065-15.064 15.065-39.488 0-54.553L45.394 86.309a9.644 9.644 0 1 1-13.638 0L11.298 65.851Z" />
                <path d="M65.851 11.298c-15.064-15.064-39.488-15.064-54.553 0-15.054 15.055-15.054 39.499 0 54.553 15.065 15.065 39.489 15.065 54.553 0L45.394 45.394a9.644 9.644 0 1 1 0-13.638l20.457-20.458Z" />
              </svg>
              <span className="self-center ml-2 text-xl font-semibold whitespace-nowrap dark:text-white">
                Request Mod
              </span>
            </Link>
            {isExtensionOpenInPopup && (
              <Tooltip placement="right" content="Open in tab">
                <button
                  onClick={() => {
                    chrome?.tabs?.create({ url: document.URL });
                  }}
                  className="flex"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                    />
                  </svg>
                </button>
              </Tooltip>
            )}
          </div>
          <div className="flex items-center">
            <select
              id="countries"
              className="mr-2 bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => {
                handleActiveEnvironmentChange(
                  e.target.value ? e.target.value : null,
                );
              }}
              value={
                currentUser?.active_env_id ? currentUser.active_env_id : ""
              }
            >
              <option value="">Select environment</option>
              {environments.map((env) => {
                return (
                  <option value={env.document_id!} key={env.document_id}>
                    {env.name}
                  </option>
                );
              })}
            </select>

            <Link to="/environments">
              <button
                type="button"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Environments
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
