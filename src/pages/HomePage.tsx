import { useContext } from "react";
import { Layout } from "../components/Layout";
import { appContext } from "../utils/app-context";

export const HomePage = () => {
  const { currentUser } = useContext(appContext);

  return (
    <Layout
      title={currentUser?.email ? `Welcome, ${currentUser.email}` : "Welcome"}
    ></Layout>
  );
};
