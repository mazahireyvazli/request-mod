import { useContext } from "react";
import { Layout } from "../components/Layout";
import { appContext } from "../utils/app-context";
import { Var } from "../models/variables";

export const VariablesPage = () => {
  const { envs, createEnv, updateEnvField, deleteVariable } =
    useContext(appContext);

  return (
    <Layout
      titleElement={
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
              Environment variables
            </h1>
          </div>
          <div>
            <button
              onClick={() => {
                createEnv("");
              }}
              className="text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium  text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add new environment
            </button>
          </div>
        </div>
      }
    >
      <div className="container mx-auto">
        {envs.map((env) => {
          const variables = env.vars;

          return (
            <div key={env.id} className="mb-8">
              <div className="mb-2">
                <input
                  className="block text-lg w-full p-3 ps-6 text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Env name"
                  id="env-name"
                  required
                  value={env.name}
                  onChange={(e) => {
                    updateEnvField(env.id, "name", e.target.value);
                  }}
                />
              </div>

              <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />

              <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-2 md:px-3 py-2 md:py-3">Name</th>
                    <th className="px-2 md:px-3py-2 md:py-3">Value</th>
                    <th className="px-2 md:px-3 py-2 md:py-3 w-px" />
                  </tr>
                </thead>
                <tbody>
                  {variables.map((v, vindex) => {
                    return (
                      <tr
                        key={`${vindex}`}
                        className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                      >
                        <td className="px-2 md:px-3 py-2 md:py-3">
                          <input
                            className="block w-full p-2 text-sm text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            type="text"
                            placeholder="Variable name"
                            value={v.name}
                            onChange={(e) => {
                              updateEnvField(
                                env.id,
                                `vars[${vindex}].name`,
                                e.target.value,
                              );
                            }}
                          />
                        </td>
                        <td className="px-2 md:px-3 py-2 md:py-3">
                          <input
                            className="block w-full p-2 text-sm text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            type="text"
                            placeholder="Variable value"
                            value={v.value}
                            onChange={(e) => {
                              updateEnvField(
                                env.id,
                                `vars[${vindex}].value`,
                                e.target.value,
                              );
                            }}
                          />
                        </td>

                        <td className="px-2 md:px-3 py-2 md:py-3 w-px">
                          <button
                            onClick={() => {
                              deleteVariable(env, v);
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
              <div className="my-4">
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={() => {
                    updateEnvField(
                      env.id,
                      `vars[${variables.length}]`,
                      new Var(),
                    );
                  }}
                >
                  Add new variable
                </button>

                <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};
