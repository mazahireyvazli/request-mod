import { PropsWithChildren, ReactNode } from "react";
import { clsx } from "clsx";
import { Sidenav } from "./Sidenav";
import { Topnav } from "./Topnav";

type LayoutProps = {
  title?: string;
  titleElement?: ReactNode;
};

export const Layout = ({
  title,
  titleElement,
  children,
}: PropsWithChildren<LayoutProps>) => {
  return (
    <section className={clsx("flex flex-col")}>
      <header>
        <Topnav />
      </header>
      <div className={clsx("flex h-screen")}>
        <Sidenav />
        <main
          role="main"
          className={clsx("flex flex-col flex-1 p-4 sm:ml-64 mt-14")}
        >
          {titleElement ? (
            <div className="flex-none">{titleElement}</div>
          ) : (
            <div className="flex-none">
              <h1 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                {title}
              </h1>
            </div>
          )}

          {title && (
            <div className="flex-none">
              <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
            </div>
          )}

          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
      <footer></footer>
    </section>
  );
};
