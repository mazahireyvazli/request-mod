import { PropsWithChildren, ReactNode } from "react";
import cx from "classnames";
import { Sidebar } from "./Sidebar";
import { isExtension } from "../utils/common";

type LayoutProps = {
  title: string;
  titleElement?: ReactNode;
};

export const Layout = ({
  title,
  titleElement,
  children,
}: PropsWithChildren<LayoutProps>) => {
  return (
    <div
      className={cx({
        "extension-wrapper": isExtension(),
      })}
    >
      <header></header>
      <div
        style={{ display: "flex", height: "100vh", overflow: "scroll initial" }}
      >
        <Sidebar />
        <main role="main" style={{ flex: 1, padding: "20px" }}>
          {titleElement ? titleElement : <h1>{title}</h1>}

          <hr />
          {children}
        </main>
      </div>
      <footer></footer>
    </div>
  );
};
