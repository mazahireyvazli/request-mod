import { PropsWithChildren, ReactNode } from "react";
import { clsx } from "clsx";
import { Sidenav } from "./Sidenav";
import { isExtension } from "../utils/common";
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
    <div
      className={clsx({
        "extension-wrapper": isExtension(),
      })}
    >
      <header>
        <Topnav />
      </header>
      <div className={clsx("flex h-screen")}>
        <Sidenav />
        <main role="main" className={clsx("flex-1 p-4 sm:ml-64 mt-14")}>
          {titleElement ? (
            titleElement
          ) : (
            <h1 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
              {title}
            </h1>
          )}

          <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />

          {children}
        </main>
      </div>
      <footer></footer>
    </div>
  );
};
