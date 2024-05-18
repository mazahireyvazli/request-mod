import { useContext, useState } from "react";
import { Layout } from "../components/Layout";
import { AppContext } from "../utils/app-context";
import { useNavigate } from "react-router-dom";
import { useWithDebounce } from "../utils/hooks";
import { StandardButton } from "../components/StandardButton";
import { DocumentID } from "../types/firestore";

export const EnvironmentsPage = () => {
  const navigate = useNavigate();

  const { environments, createEnv, deleteEnv } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);

  const withDebounce = useWithDebounce();

  const handleCreate = () => {
    setIsLoading(true);
    withDebounce(async () => {
      const [data, err] = await createEnv("");

      if (err !== null || !data) {
        console.log(err);
        setIsLoading(false);
        return;
      }

      navigate(`/environments/${data.document_id}`);
      setIsLoading(false);
    });
  };

  const handleDelete = (document_id: DocumentID) => {
    setIsLoading(true);
    withDebounce(async () => {
      await deleteEnv(document_id);
      setIsLoading(false);
    });
  };

  return (
    <Layout
      titleElement={
        <div className="mb-2 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
              Environments
            </h1>
          </div>
          <div>
            <StandardButton
              disabled={isLoading}
              loading={isLoading}
              onClick={() => {
                handleCreate();
              }}
            >
              Add new environment
            </StandardButton>
          </div>
        </div>
      }
    >
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />

      <div className="container mx-auto">
        <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-2 md:px-3 py-2 md:py-3">Name</th>
              <th className="px-2 md:px-3 py-2 md:py-3 w-px">Actions</th>
            </tr>
          </thead>
          <tbody>
            {environments.map((env) => {
              return (
                <tr
                  key={env.document_id}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td className="px-2 md:px-3 py-2 md:py-3">{env.name}</td>
                  <td className="px-2 md:px-3 py-2 md:py-3 w-px">
                    <button
                      onClick={() => {
                        navigate(`/environments/${env?.document_id}`);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 stroke-current hover:stroke-green-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(env.document_id!);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 stroke-current hover:stroke-red-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
