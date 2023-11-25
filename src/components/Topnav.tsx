export const Topnav = () => {
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
            <a href="/" className="flex items-center ms-2 md:me-24">
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
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
