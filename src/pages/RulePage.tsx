import { initFlowbite } from "flowbite";
import { Toast, Tooltip } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Header } from "../models/header";
import { RuleSetContext } from "../utils/ruleset-context";

export const RulePage = () => {
  const { id } = useParams();

  const parsedId = Number(id);

  if (!parsedId) {
    return "page not found";
  }

  const { rules, updateRuleField, deleteRuleHeader, saveRule } =
    useContext(RuleSetContext);
  const rule = rules.find((r) => r.id === parsedId);

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    initFlowbite();
  }, []);

  if (!rule) {
    return "rule not found";
  }

  return (
    <Layout
      title={rule.name}
      titleElement={
        <div>
          <label
            htmlFor="rule-name"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Rule name
          </label>
          <div className="relative">
            <input
              className="block text-lg w-full p-4 ps-10 text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Rule name"
              id="rule-name"
              required
              value={rule.name}
              onChange={(e) => {
                updateRuleField(parsedId, "name", e.target.value);
              }}
            />
            <button
              onClick={() => {
                saveRule(rule).then(() => {
                  setShowToast(true);
                  setTimeout(() => {
                    setShowToast(false);
                  }, 1500);
                });
              }}
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium  text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save
            </button>

            {showToast && (
              <Toast className="fixed flex justify-center items-center w-full p-4 bottom-5">
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200"></div>
                <div className="ml-3 text-sm font-normal">
                  Rule saved successfully
                </div>
                <Toast.Toggle onDismiss={() => setShowToast(false)} />
              </Toast>
            )}
          </div>
        </div>
      }
    >
      <div className="container mx-auto">
        <h4 className="text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl dark:text-white">
          Headers
        </h4>
        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="relative overflow-x-auto">
          <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-2 md:px-3 py-2 md:py-3 w-px"></th>
                <th className="px-2 md:px-3 py-2 md:py-3">Name</th>
                <th className="px-2 md:px-3py-2 md:py-3">Value</th>
                <th className="px-2 md:px-3 py-2 md:py-3 w-px"></th>
              </tr>
            </thead>
            <tbody>
              {rule.headers.map((header, index) => {
                return (
                  <tr
                    key={`${index}`}
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                    <td className="px-2 md:px-3 py-2 md:py-3 w-px">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={header.active}
                          onChange={(e) => {
                            updateRuleField(
                              parsedId,
                              `headers[${index}].active`,
                              e.target.checked,
                            );
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-2 md:px-3 py-2 md:py-3">
                      <input
                        className="block w-full p-2 text-sm text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="text"
                        placeholder="Header name"
                        value={header.name}
                        onChange={(e) => {
                          updateRuleField(
                            parsedId,
                            `headers[${index}].name`,
                            e.target.value,
                          );
                        }}
                      />
                    </td>
                    <td className="px-2 md:px-3 py-2 md:py-3">
                      <input
                        className="block w-full p-2 text-sm text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="text"
                        placeholder="Header value"
                        value={header.value}
                        onChange={(e) => {
                          updateRuleField(
                            parsedId,
                            `headers[${index}].value`,
                            e.target.value,
                          );
                        }}
                      />
                    </td>

                    <td className="px-2 md:px-3 py-2 md:py-3 w-px">
                      <button
                        onClick={() => {
                          deleteRuleHeader(header);
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
              className="text-white end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
              onClick={() => {
                updateRuleField(
                  parsedId,
                  `headers[${rule.headers.length}]`,
                  new Header(),
                );
              }}
            >
              Add new header
            </button>
          </div>
        </div>

        <h4 className="text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl dark:text-white">
          URL pattern with{" "}
          <a
            className="text-sky-400 hover:underline"
            href="https://github.com/google/re2/wiki/Syntax"
            target="_blank"
          >
            RE2 syntax
          </a>
        </h4>

        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />

        <Tooltip
          content="URL regexp to apply the rule. Accepts RE2 syntax."
          placement="bottom-start"
        >
          <input
            className="block w-full p-2 text-sm text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            placeholder="http://localhost:8080"
            value={rule.urlPattern}
            onChange={(e) => {
              updateRuleField(parsedId, `urlPattern`, e.target.value);
            }}
          />
        </Tooltip>
      </div>
    </Layout>
  );
};
