import { useEffect } from "react";
import { Layout } from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { storageLastPageKey } from "../utils/common";

export const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const lastPagePath = localStorage.getItem(storageLastPageKey);

    if (lastPagePath) {
      navigate(lastPagePath, {
        replace: true,
      });
    }
  }, []);

  return <Layout title="Home">homepage</Layout>;
};
