import { useContext } from "react";
import { Layout } from "../components/Layout";
import { AppContext } from "../utils/app-context";

export const HomePage = () => {
  const { currentUser } = useContext(AppContext);

  return (
    <Layout
      title={currentUser?.email ? `Welcome, ${currentUser.email}` : "Welcome"}
    ></Layout>
  );
};
